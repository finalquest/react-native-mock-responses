import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';
import { FileService } from './fileService';

const execAsync = promisify(exec);

const PROJECT_ROOT = app.getAppPath();
const RESPONSES_DIR = path.join(PROJECT_ROOT, 'src', 'responses');

const MOCK_FILES = {
  MSW: 'msw-mock.json',
  STORAGE: 'storage-mock.json',
  RESPONSES: 'msw-responses.json',
  STORAGE_RECORDS: 'storage-records.json',
} as const;

interface InstalledApp {
  packageName: string;
  appName: string;
}

interface ResponseFile {
  filename: string;
  data: any;
}

export class AdbService {
  private static async runAdbCommand(
    command: string,
    timeout: number = 5000
  ): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(command, { timeout });
      if (stderr) {
        console.error('ADB stderr:', stderr);
      }
      return stdout;
    } catch (error) {
      console.error('ADB command error:', error);
      throw error;
    }
  }

  public static async getConnectedDevices(): Promise<string[]> {
    const output = await this.runAdbCommand('adb devices');
    const lines = output.split('\n');
    return lines
      .slice(1) // Skip the first line (header)
      .filter((line) => line.trim() && !line.includes('offline'))
      .map((line) => line.split('\t')[0]);
  }

  public static async getInstalledApps(
    deviceId: string
  ): Promise<InstalledApp[]> {
    console.log(`Getting installed apps for device ${deviceId}`);

    try {
      // Get all packages with a timeout
      const packagesOutput = await this.runAdbCommand(
        `adb -s ${deviceId} shell pm list packages -3`,
        10000
      );
      if (!packagesOutput) {
        console.error('No packages output received');
        return [];
      }

      const packageNames = packagesOutput
        .split('\n')
        .filter((line) => line.startsWith('package:'))
        .map((line) => line.replace('package:', '').trim());

      if (packageNames.length === 0) {
        console.log('No packages found');
        return [];
      }

      console.log('Found package names:', packageNames);

      // Get app names for each package
      const apps: InstalledApp[] = [];
      for (const packageName of packageNames) {
        try {
          // Use a simpler command to get app name
          const appNameOutput = await this.runAdbCommand(
            `adb -s ${deviceId} shell pm list packages -3 ${packageName}`,
            2000
          ).catch(() => '');

          // Extract app name from the output or use package name as fallback
          const appName =
            appNameOutput
              .split('\n')
              .find((line) => line.includes(packageName))
              ?.replace('package:', '')
              ?.trim() || packageName;

          apps.push({
            packageName,
            appName,
          });
        } catch (err) {
          console.error(`Error processing package ${packageName}:`, err);
          // If we can't get the app name, use the package name
          apps.push({
            packageName,
            appName: packageName,
          });
        }
      }

      return apps.sort((a, b) => a.appName.localeCompare(b.appName));
    } catch (error) {
      console.error('Error in getInstalledApps:', error);
      return [];
    }
  }

  public static async pullResponses(
    deviceId: string,
    packageName: string,
    filename: string,
    linkStorage: boolean = false
  ): Promise<ResponseFile[]> {
    console.log(
      `Pulling responses for package ${packageName} from device ${deviceId} with filename ${filename}, linkStorage: ${linkStorage}`
    );

    try {
      // Run adb root first
      console.log('Running adb root...');
      await this.runAdbCommand(`adb -s ${deviceId} root`);

      // Get the save path from FileService
      const savePath = FileService.getSavePath() || RESPONSES_DIR;
      console.log('Using save path:', savePath);

      // Create responses directory if it doesn't exist
      if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath, { recursive: true });
      }

      const result: ResponseFile[] = [];

      // Pull the responses file from the device
      const responsesRemotePath = `/data/user/0/${packageName}/files/${MOCK_FILES.RESPONSES}`;
      const responsesLocalPath = path.join(savePath, `${filename}.json`);

      console.log(
        `Pulling responses from ${responsesRemotePath} to ${responsesLocalPath}`
      );
      await this.runAdbCommand(
        `adb -s ${deviceId} pull ${responsesRemotePath} ${responsesLocalPath}`
      );

      // Read and parse the pulled responses file
      if (fs.existsSync(responsesLocalPath)) {
        const content = fs.readFileSync(responsesLocalPath, 'utf-8');
        const data = JSON.parse(content);

        result.push({
          filename: `${filename}.json`,
          data: data,
        });
      }

      // If linkStorage is true, also pull the storage file
      if (linkStorage) {
        const storageRemotePath = `/data/user/0/${packageName}/files/${MOCK_FILES.STORAGE_RECORDS}`;
        const storageLocalPath = path.join(
          savePath,
          `${filename}-storage.json`
        );

        console.log(
          `Pulling storage from ${storageRemotePath} to ${storageLocalPath}`
        );
        try {
          await this.runAdbCommand(
            `adb -s ${deviceId} pull ${storageRemotePath} ${storageLocalPath}`
          );

          // Read and parse the pulled storage file
          if (fs.existsSync(storageLocalPath)) {
            const content = fs.readFileSync(storageLocalPath, 'utf-8');
            const data = JSON.parse(content);

            result.push({
              filename: `${filename}-storage.json`,
              data: data,
            });
          }
        } catch (error) {
          console.error('Error pulling storage file:', error);
          // Don't throw the error, just log it and continue
        }
      }

      return result;
    } catch (error) {
      console.error('Error pulling responses:', error);
      throw error;
    }
  }

  public static async pushResponses(
    deviceId: string,
    packageName: string,
    selectedFile: string
  ): Promise<void> {
    // Run adb root first
    console.log('Running adb root...');
    await this.runAdbCommand(`adb -s ${deviceId} root`);

    const savePath = FileService.getSavePath() || RESPONSES_DIR;
    const localPath = path.join(savePath, selectedFile);
    const remotePath = `/data/user/0/${packageName}/files/${MOCK_FILES.MSW}`;

    console.log(`Pushing responses from ${localPath} to device ${deviceId}`);
    await this.runAdbCommand(
      `adb -s ${deviceId} push ${localPath} ${remotePath}`
    );

    // Check if there's an associated storage file
    const storageFilename = selectedFile.replace('.json', '-storage.json');
    const storageLocalPath = path.join(savePath, storageFilename);
    const storageRemotePath = `/data/user/0/${packageName}/files/${MOCK_FILES.STORAGE}`;

    if (fs.existsSync(storageLocalPath)) {
      console.log(
        `Pushing storage from ${storageLocalPath} to device ${deviceId}`
      );
      await this.runAdbCommand(
        `adb -s ${deviceId} push ${storageLocalPath} ${storageRemotePath}`
      );
    }
  }

  public static async restartApp(
    deviceId: string,
    packageName: string
  ): Promise<void> {
    try {
      await this.runAdbCommand(
        `adb -s ${deviceId} shell am force-stop ${packageName}`
      );
      await this.runAdbCommand(
        `adb -s ${deviceId} shell am start -n ${packageName}/.MainActivity`
      );
    } catch (error) {
      console.error('Error restarting app:', error);
      throw error;
    }
  }

  public static async cleanFiles(
    deviceId: string,
    packageName: string
  ): Promise<void> {
    try {
      await this.runAdbCommand(
        `adb -s ${deviceId} shell rm -f /data/user/0/${packageName}/files/${MOCK_FILES.MSW}`
      );
      await this.runAdbCommand(
        `adb -s ${deviceId} shell rm -f /data/user/0/${packageName}/files/${MOCK_FILES.STORAGE}`
      );
    } catch (error) {
      console.error('Error cleaning files:', error);
      throw error;
    }
  }
}
