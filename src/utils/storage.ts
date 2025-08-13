import { FileOperationResult } from '../types';

// Check if we're in Electron environment
const isElectron = () => {
  return typeof window !== 'undefined' && window.require;
};

/**
 * Save data to a file
 */
export const saveFile = async (filePath: string, data: any): Promise<FileOperationResult> => {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron environment' };
  }

  try {
    const { ipcRenderer } = window.require('electron');
    const result = await ipcRenderer.invoke('save-file', { filePath, data });
    return result;
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Load data from a file
 */
export const loadFile = async (filePath: string): Promise<FileOperationResult> => {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron environment' };
  }

  try {
    const { ipcRenderer } = window.require('electron');
    const result = await ipcRenderer.invoke('load-file', filePath);
    return result;
  } catch (error) {
    console.error('Error loading file:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * List files in a directory
 */
export const listFiles = async (directory: string): Promise<FileOperationResult> => {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron environment' };
  }

  try {
    const { ipcRenderer } = window.require('electron');
    const result = await ipcRenderer.invoke('list-files', directory);
    return { ...result, files: result.files || [] };
  } catch (error) {
    console.error('Error listing files:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Delete a file
 */
export const deleteFile = async (filePath: string): Promise<FileOperationResult> => {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron environment' };
  }

  try {
    const { ipcRenderer } = window.require('electron');
    const result = await ipcRenderer.invoke('delete-file', filePath);
    return result;
  } catch (error) {
    console.error('Error deleting file:', error);
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
