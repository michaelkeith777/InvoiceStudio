import { FileOperationResult } from '../types';

/**
 * Check if running in Electron
 */
const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.process && window.process.type === 'renderer';
};

/**
 * Save data to browser localStorage
 */
export const saveFile = async (filePath: string, data: any): Promise<FileOperationResult> => {
  try {
    const key = `invoice-studio-${filePath.replace(/[^a-zA-Z0-9]/g, '-')}`;
    localStorage.setItem(key, JSON.stringify(data));
    return { success: true };
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Load data from browser localStorage
 */
export const loadFile = async (filePath: string): Promise<FileOperationResult> => {
  try {
    const key = `invoice-studio-${filePath.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const data = localStorage.getItem(key);
    if (data === null) {
      return { success: false, error: 'File not found' };
    }
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * List files in a directory (browser localStorage simulation)
 */
export const listFiles = async (directory: string): Promise<FileOperationResult> => {
  try {
    const prefix = `invoice-studio-${directory.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const files: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const fileName = key.replace(prefix + '-', '').replace(/-/g, '/');
        files.push(fileName);
      }
    }
    
    return { success: true, files };
  } catch (error) {
    console.error('Error listing files from localStorage:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Delete a file from browser localStorage
 */
export const deleteFile = async (filePath: string): Promise<FileOperationResult> => {
  try {
    const key = `invoice-studio-${filePath.replace(/[^a-zA-Z0-9]/g, '-')}`;
    localStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Export invoice as PDF using browser print functionality
 */
export const exportToPDF = async (htmlContent: string, filename: string): Promise<FileOperationResult> => {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups.');
    }

    // Write the HTML content with print styles
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { 
                size: A4; 
                margin: 0.5in; 
              }
            }
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };

    return { success: true, path: filename };
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Show save dialog
 */
export const showSaveDialog = async (options: any): Promise<any> => {
  if (!isElectron()) {
    return { canceled: true, error: 'Not running in Electron environment' };
  }

  try {
    const { ipcRenderer } = window.require('electron');
    const result = await ipcRenderer.invoke('show-save-dialog', options);
    return result;
  } catch (error) {
    console.error('Error showing save dialog:', error);
    return { canceled: true, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Show open dialog
 */
export const showOpenDialog = async (options: any): Promise<any> => {
  if (!isElectron()) {
    return { canceled: true, error: 'Not running in Electron environment' };
  }

  try {
    const { ipcRenderer } = window.require('electron');
    const result = await ipcRenderer.invoke('show-open-dialog', options);
    return result;
  } catch (error) {
    console.error('Error showing open dialog:', error);
    return { canceled: true, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Get user data path
 */
export const getUserDataPath = async (): Promise<string> => {
  if (!isElectron()) {
    return '';
  }

  try {
    const { ipcRenderer } = window.require('electron');
    const path = await ipcRenderer.invoke('get-user-data-path');
    return path;
  } catch (error) {
    console.error('Error getting user data path:', error);
    return '';
  }
};
