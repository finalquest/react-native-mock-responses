import { contextBridge, ipcRenderer } from 'electron';
import { ResponseFile } from '../src/types/response';

console.log('Preload script loaded');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  getResponseFiles: () => ipcRenderer.invoke('get-response-files'),
  getResponseFile: (filename: string) =>
    ipcRenderer.invoke('get-response-file', filename),
  saveResponseFile: (data: { filename: string; content: any }) =>
    ipcRenderer.invoke('save-response-file', data),
  getConnectedDevices: () => ipcRenderer.invoke('get-connected-devices'),
  getInstalledApps: (deviceId: string) =>
    ipcRenderer.invoke('get-installed-apps', deviceId),
  pullResponses: (deviceId: string, packageName: string, filename: string) =>
    ipcRenderer.invoke('pull-responses', deviceId, packageName, filename),
  pushResponses: (
    deviceId: string,
    packageName: string,
    selectedFile: string
  ) =>
    ipcRenderer.invoke('push-responses', deviceId, packageName, selectedFile),
  restartApp: (deviceId: string, packageName: string) =>
    ipcRenderer.invoke('restart-app', deviceId, packageName),
  cleanFiles: (deviceId: string, packageName: string) =>
    ipcRenderer.invoke('clean-files', deviceId, packageName),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  setSavePath: (path: string) => ipcRenderer.invoke('set-save-path', path),
  getSavePath: () => ipcRenderer.invoke('get-save-path'),
  onResponsesUpdated: (callback: (files: ResponseFile[]) => void) => {
    const subscription = (_event: any, files: ResponseFile[]) =>
      callback(files);
    ipcRenderer.on('responses-updated', subscription);
    return () => {
      ipcRenderer.removeListener('responses-updated', subscription);
    };
  },
});
