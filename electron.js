const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

const isDev = process.env.ELECTRON_IS_DEV === '1';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    titleBarStyle: 'default',
    show: false
  });

  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Get user data directory
const getUserDataPath = () => {
  const userDataPath = path.join(os.homedir(), 'Invoice Studio Pro');
  return userDataPath;
};

// Ensure directories exist
const ensureDirectories = async () => {
  const basePath = getUserDataPath();
  const directories = [
    path.join(basePath, 'invoices'),
    path.join(basePath, 'templates'),
    path.join(basePath, 'profiles'),
    path.join(basePath, 'exports')
  ];

  for (const dir of directories) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};

// IPC handlers for file operations
ipcMain.handle('get-user-data-path', () => {
  return getUserDataPath();
});

ipcMain.handle('ensure-directories', async () => {
  await ensureDirectories();
  return true;
});

ipcMain.handle('save-file', async (event, { filePath, data }) => {
  try {
    await ensureDirectories();
    const fullPath = path.join(getUserDataPath(), filePath);
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-file', async (event, filePath) => {
  try {
    const fullPath = path.join(getUserDataPath(), filePath);
    const data = await fs.readFile(fullPath, 'utf8');
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-files', async (event, directory) => {
  try {
    const fullPath = path.join(getUserDataPath(), directory);
    const files = await fs.readdir(fullPath);
    const fileList = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(fullPath, file);
          const stats = await fs.stat(filePath);
          const content = await fs.readFile(filePath, 'utf8');
          const data = JSON.parse(content);
          
          fileList.push({
            filename: file,
            path: path.join(directory, file),
            data,
            modifiedAt: stats.mtime
          });
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
        }
      }
    }

    return { success: true, files: fileList };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    const fullPath = path.join(getUserDataPath(), filePath);
    await fs.unlink(fullPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// PDF Export
ipcMain.handle('export-pdf', async (event, { htmlContent, filename }) => {
  try {
    await ensureDirectories();
    
    // Create a new window for PDF generation
    const pdfWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    // Load the HTML content
    await pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    // Generate PDF
    const pdfBuffer = await pdfWindow.webContents.printToPDF({
      pageSize: 'A4',
      margins: {
        top: 0.5,
        bottom: 0.5,
        left: 0.5,
        right: 0.5
      },
      printBackground: true,
      landscape: false
    });

    // Save PDF
    const pdfPath = path.join(getUserDataPath(), 'exports', filename);
    await fs.writeFile(pdfPath, pdfBuffer);

    // Close the PDF window
    pdfWindow.close();

    // Show save dialog
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: filename,
      filters: [
        { name: 'PDF Files', extensions: ['pdf'] }
      ]
    });

    if (filePath) {
      await fs.copyFile(pdfPath, filePath);
    }

    return { success: true, path: filePath || pdfPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Show save/open dialogs
ipcMain.handle('show-save-dialog', async (event, options) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
  } catch (error) {
    return { canceled: true, error: error.message };
  }
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
  } catch (error) {
    return { canceled: true, error: error.message };
  }
});
