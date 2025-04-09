import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { FileService } from './services/fileService'

// Set up IPC handlers
function setupIpcHandlers() {
  console.log('Setting up IPC handlers')
  
  ipcMain.handle('get-response-files', async () => {
    console.log('Main: get-response-files handler called')
    console.log('Main: About to call FileService.getResponseFiles()')
    try {
      const files = await FileService.getResponseFiles()
      console.log(`Main: Found ${files.length} response files`)
      console.log('Main: Response files:', files)
      return files
    } catch (error) {
      console.error('Main: Error in get-response-files handler:', error)
      throw error
    }
  })

  ipcMain.handle('get-response-file', async (_, filename: string) => {
    console.log(`Main: get-response-file handler called with filename: ${filename}`)
    try {
      const file = await FileService.getResponseFile(filename)
      console.log(`Main: Response file ${filename} ${file ? 'found' : 'not found'}`)
      return file
    } catch (error) {
      console.error('Main: Error in get-response-file handler:', error)
      throw error
    }
  })
}

const createWindow = () => {
  const preloadPath = path.join(__dirname, 'preload.js')
  console.log('Preload script path:', preloadPath)

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true
    },
  })

  // In development, load from the Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    // Always open DevTools in development
    mainWindow.webContents.openDevTools()
    console.log('Development mode: DevTools opened')
  } else {
    // In production, load from the built files
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // Log when the window is ready
  mainWindow.webContents.on('did-finish-load', async () => {
    console.log('Window loaded successfully')
    // Test the FileService
    console.log('Testing FileService...')
    try {
      const files = await FileService.getResponseFiles()
      console.log('Test result:', files)
    } catch (error) {
      console.error('Test error:', error)
    }
  })

  // Log any errors
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Renderer console [${level}]: ${message}`)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  console.log('Electron app ready')
  setupIpcHandlers()
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 