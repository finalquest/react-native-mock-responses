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
    },
    // ADB methods
    getConnectedDevices: async (): Promise<string[]> => {
      console.log('Preload: getConnectedDevices called')
      try {
        const result = await ipcRenderer.invoke('get-connected-devices')
        console.log('Preload: getConnectedDevices result:', result)
        return result
      } catch (error) {
        console.error('Preload: getConnectedDevices error:', error)
        throw error
      }
    },
    pullResponses: async (deviceId: string): Promise<ResponseFile[]> => {
      console.log('Preload: pullResponses called with deviceId:', deviceId)
      try {
        const result = await ipcRenderer.invoke('pull-responses', deviceId)
        console.log('Preload: pullResponses result:', result)
        return result
      } catch (error) {
        console.error('Preload: pullResponses error:', error)
        throw error
      }
    },
    pushResponses: async (deviceId: string): Promise<void> => {
      console.log('Preload: pushResponses called with deviceId:', deviceId)
      try {
        await ipcRenderer.invoke('push-responses', deviceId)
        console.log('Preload: pushResponss successful')
      } catch (error) {
        console.error('Preload: pushResponses error:', error)
        throw error
      }
    },
    restartApp: async (deviceId: string): Promise<void> => {
      console.log('Preload: restartApp called with deviceId:', deviceId)
      try {
        await ipcRenderer.invoke('restart-app', deviceId)
        console.log('Preload: restartApp successful')
      } catch (error) {
        console.error('Preload: restartApp error:', error)
        throw error
      }
    }
  }
) 