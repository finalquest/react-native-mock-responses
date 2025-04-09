import { contextBridge, ipcRenderer } from 'electron'
import { ResponseFile } from '../src/types/response'

console.log('Preload script loaded')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    getResponseFiles: async (): Promise<ResponseFile[]> => {
      console.log('Preload: getResponseFiles called')
      try {
        const result = await ipcRenderer.invoke('get-response-files')
        console.log('Preload: getResponseFiles result:', result)
        return result
      } catch (error) {
        console.error('Preload: getResponseFiles error:', error)
        throw error
      }
    },
    getResponseFile: async (filename: string): Promise<ResponseFile | null> => {
      console.log('Preload: getResponseFile called with filename:', filename)
      try {
        const result = await ipcRenderer.invoke('get-response-file', filename)
        console.log('Preload: getResponseFile result:', result)
        return result
      } catch (error) {
        console.error('Preload: getResponseFile error:', error)
        throw error
      }
    },
    saveResponseFile: async (data: { filename: string; data: Record<string, any> }): Promise<void> => {
      console.log('Preload: saveResponseFile called with data:', data)
      try {
        await ipcRenderer.invoke('save-response-file', data)
        console.log('Preload: saveResponseFile successful')
      } catch (error) {
        console.error('Preload: saveResponseFile error:', error)
        throw error
      }
    }
  }
) 