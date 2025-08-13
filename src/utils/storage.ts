import { FileOperationResult } from '../types';

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
 * Export invoice as PDF
 */
export const exportToPDF = async (htmlContent: string, filename: string): Promise<FileOperationResult> => {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron environment' };
  }

  try {
    const { ipcRenderer } = window.require('electron');
    const result = await ipcRenderer.invoke('export-pdf', { htmlContent, filename });
    return result;
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
