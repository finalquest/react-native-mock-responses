import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { FileService } from './services/fileService';
import { AdbService } from './services/adbService';

// Set up IPC handlers
function setupIpcHandlers() {
  console.log('Setting up IPC handlers');

  ipcMain.handle('set-save-path', async (_, savePath: string) => {
    console.log('Main: set-save-path handler called with path:', savePath);
    try {
      FileService.setSavePath(savePath);
      return true;
    } catch (error) {
      console.error('Main: Error in set-save-path handler:', error);
      throw error;
    }
  });

  ipcMain.handle('select-folder', async () => {
    console.log('Main: select-folder handler called');
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
      }
      return null;
    } catch (error) {
      console.error('Main: Error in select-folder handler:', error);
      throw error;
    }
  });

  ipcMain.handle('get-response-files', async () => {
    console.log('Main: get-response-files handler called');
    console.log('Main: About to call FileService.getResponseFiles()');
    try {
      const files = await FileService.getResponseFiles();
      console.log(`Main: Found ${files.length} response files`);
      console.log('Main: Response files:', files);
      return files;
    } catch (error) {
      console.error('Main: Error in get-response-files handler:', error);
      throw error;
    }
  });

  ipcMain.handle('get-response-file', async (_, filename: string) => {
    console.log(
      `Main: get-response-file handler called with filename: ${filename}`
    );
    try {
      const file = await FileService.getResponseFile(filename);
      console.log(
        `Main: Response file ${filename} ${file ? 'found' : 'not found'}`
      );
      return file;
    } catch (error) {
      console.error('Main: Error in get-response-file handler:', error);
      throw error;
    }
  });

  ipcMain.handle(
    'save-response-file',
    async (_, data: { filename: string; content: any }) => {
      console.log(
        `Main: save-response-file handler called with filename: ${data.filename}`
      );
      try {
        await FileService.saveResponseFile(data.filename, data.content);
        console.log(`Main: Response file ${data.filename} saved successfully`);
      } catch (error) {
        console.error('Main: Error in save-response-file handler:', error);
        throw error;
      }
    }
  );

  // ADB handlers
  ipcMain.handle('get-connected-devices', async () => {
    console.log('Main: get-connected-devices handler called');
    try {
      const devices = await AdbService.getConnectedDevices();
      console.log(`Main: Found ${devices.length} connected devices`);
      return devices;
    } catch (error) {
      console.error('Main: Error in get-connected-devices handler:', error);
      throw error;
    }
  });

  ipcMain.handle('get-installed-apps', async (_, deviceId: string) => {
    console.log(
      `Main: get-installed-apps handler called for device: ${deviceId}`
    );
    try {
      const apps = await AdbService.getInstalledApps(deviceId);
      console.log(`Main: Found ${apps.length} installed apps`);
      return apps;
    } catch (error) {
      console.error('Main: Error in get-installed-apps handler:', error);
      throw error;
    }
  });

  ipcMain.handle(
    'pull-responses',
    async (
      _,
      deviceId: string,
      packageName: string,
      filename: string,
      linkStorage: boolean
    ) => {
      console.log(
        `Main: pull-responses handler called for device: ${deviceId}, package: ${packageName}, filename: ${filename}, linkStorage: ${linkStorage}`
      );
      try {
        const files = await AdbService.pullResponses(
          deviceId,
          packageName,
          filename,
          linkStorage
        );
        console.log('Main: Responses pulled successfully');
        return files;
      } catch (error) {
        console.error('Main: Error in pull-responses handler:', error);
        throw error;
      }
    }
  );

  ipcMain.handle(
    'clean-files',
    async (_, deviceId: string, packageName: string) => {
      console.log(
        `Main: clean-files handler called for device: ${deviceId}, package: ${packageName}`
      );
      try {
        await AdbService.cleanFiles(deviceId, packageName);
        console.log('Main: Files cleaned successfully');
      } catch (error) {
        console.error('Main: Error in clean-files handler:', error);
        throw error;
      }
    }
  );

  ipcMain.handle(
    'push-responses',
    async (_, deviceId: string, packageName: string, selectedFile: string) => {
      console.log(
        `Main: push-responses handler called for device: ${deviceId}, package: ${packageName}, file: ${selectedFile}`
      );
      try {
        await AdbService.pushResponses(deviceId, packageName, selectedFile);
        console.log('Main: Responses pushed successfully');
      } catch (error) {
        console.error('Main: Error in push-responses handler:', error);
        throw error;
      }
    }
  );

  ipcMain.handle(
    'restart-app',
    async (_, deviceId: string, packageName: string) => {
      console.log(
        `Main: restart-app handler called for device: ${deviceId}, package: ${packageName}`
      );
      try {
        await AdbService.restartApp(deviceId, packageName);
        console.log('Main: App restarted successfully');
      } catch (error) {
        console.error('Main: Error in restart-app handler:', error);
        throw error;
      }
    }
  );

  ipcMain.handle('get-save-path', async () => {
    console.log('Main: get-save-path handler called');
    try {
      return FileService.getSavePath();
    } catch (error) {
      console.error('Main: Error in get-save-path handler:', error);
      throw error;
    }
  });

  ipcMain.handle('open-file-explorer', async () => {
    console.log('Main: open-file-explorer handler called');
    try {
      const savePath = FileService.getSavePath();
      if (savePath) {
        const { exec } = require('child_process');
        const command =
          process.platform === 'win32'
            ? `explorer "${savePath}"`
            : process.platform === 'darwin'
              ? `open "${savePath}"`
              : `xdg-open "${savePath}"`;

        await new Promise((resolve, reject) => {
          exec(command, (error: any) => {
            if (error) {
              console.error('Error opening file explorer:', error);
              reject(error);
            } else {
              resolve(true);
            }
          });
        });
      }
      return true;
    } catch (error) {
      console.error('Main: Error in open-file-explorer handler:', error);
      throw error;
    }
  });
}

const createWindow = () => {
  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('Preload script path:', preloadPath);

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // In development, load from the Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // Always open DevTools in development
    mainWindow.webContents.openDevTools();
    console.log('Development mode: DevTools opened');
  } else {
    // In production, load from the built files
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Log when the window is ready
  mainWindow.webContents.on('did-finish-load', async () => {
    console.log('Window loaded successfully');
    // Test the FileService
    console.log('Testing FileService...');
    try {
      const files = await FileService.getResponseFiles();
      console.log('Test result:', files);
    } catch (error) {
      console.error('Test error:', error);
    }
  });

  // Log any errors
  mainWindow.webContents.on(
    'console-message',
    (event, level, message, _line, _sourceId) => {
      console.log(`Renderer console [${level}]: ${message}`);
    }
  );
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  console.log('Electron app ready');
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
