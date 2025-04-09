import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { app } from 'electron'

const execAsync = promisify(exec)

const PROJECT_ROOT = app.getAppPath()
const RESPONSES_DIR = path.join(PROJECT_ROOT, 'src', 'responses')

export class AdbService {
  private static async runAdbCommand(command: string): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(command)
      if (stderr) {
        console.error('ADB stderr:', stderr)
      }
      return stdout
    } catch (error) {
      console.error('ADB command error:', error)
      throw error
    }
  }

  public static async getConnectedDevices(): Promise<string[]> {
    const output = await this.runAdbCommand('adb devices')
    const lines = output.split('\n')
    return lines
      .slice(1) // Skip the first line (header)
      .filter(line => line.trim() && !line.includes('offline'))
      .map(line => line.split('\t')[0])
  }

  public static async pullResponses(deviceId: string): Promise<void> {
    const remotePath = '/data/user/0/ar.com.bind.bind24.qa/files/msw-responses.json'
    const localPath = path.join(RESPONSES_DIR, 'msw-responses.json')
    
    console.log(`Pulling responses from device ${deviceId} to ${localPath}`)
    await this.runAdbCommand(`adb -s ${deviceId} pull ${remotePath} ${localPath}`)
  }

  public static async pushResponses(deviceId: string): Promise<void> {
    const localPath = path.join(RESPONSES_DIR, 'msw-responses.json')
    const remotePath = '/data/user/0/ar.com.bind.bind24.qa/files/msw-responses.json'
    
    console.log(`Pushing responses from ${localPath} to device ${deviceId}`)
    await this.runAdbCommand(`adb -s ${deviceId} push ${localPath} ${remotePath}`)
  }

  public static async restartApp(deviceId: string): Promise<void> {
    const packageName = 'ar.com.bind.bind24.qa'
    console.log(`Restarting app ${packageName} on device ${deviceId}`)
    
    // Force stop the app
    await this.runAdbCommand(`adb -s ${deviceId} shell am force-stop ${packageName}`)
    
    // Start the app
    await this.runAdbCommand(`adb -s ${deviceId} shell monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`)
  }
} 