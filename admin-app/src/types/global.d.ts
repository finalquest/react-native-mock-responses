import { ResponseFile } from './response';

declare global {
  interface Window {
    api: {
      getResponseFiles(): Promise<ResponseFile[]>;
      getResponseFile(filename: string): Promise<ResponseFile | null>;
      saveResponseFile(data: {
        filename: string;
        data: Record<string, any>;
      }): Promise<void>;
      getConnectedDevices(): Promise<string[]>;
      getInstalledApps(
        deviceId: string
      ): Promise<{ packageName: string; appName: string }[]>;
      pullResponses(
        deviceId: string,
        packageName: string,
        filename: string
      ): Promise<ResponseFile[]>;
      pushResponses(
        deviceId: string,
        packageName: string,
        selectedFile: string
      ): Promise<void>;
      restartApp(deviceId: string, packageName: string): Promise<void>;
      cleanFiles(deviceId: string, packageName: string): Promise<void>;
    };
  }
}
