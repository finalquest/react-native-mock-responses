import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { app } from 'electron'
import fs from 'fs'

const execAsync = promisify(exec)

const PROJECT_ROOT = app.getAppPath()
const RESPONSES_DIR = path.join(PROJECT_ROOT, 'src', 'responses')

interface InstalledApp {
  packageName: string
  appName: string
}

interface ResponseFile {
  filename: string
  data: any
}

export class AdbService {
  private static async runAdbCommand(command: string, timeout: number = 5000): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(command, { timeout })
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

  public static async getInstalledApps(deviceId: string): Promise<InstalledApp[]> {
    console.log(`Getting installed apps for device ${deviceId}`)
    
    try {
      // Get all packages with a timeout
      const packagesOutput = await this.runAdbCommand(`adb -s ${deviceId} shell pm list packages -3`, 10000)
      if (!packagesOutput) {
        console.error('No packages output received')
        return []
      }
      
      const packageNames = packagesOutput
        .split('\n')
        .filter(line => line.startsWith('package:'))
        .map(line => line.replace('package:', '').trim())
      
      if (packageNames.length === 0) {
        console.log('No packages found')
        return []
      }

      console.log('Found package names:', packageNames)

      // Get app names for each package
      const apps: InstalledApp[] = []
      for (const packageName of packageNames) {
        try {
          // Use a simpler command to get app name
          const appNameOutput = await this.runAdbCommand(
            `adb -s ${deviceId} shell pm list packages -3 ${packageName}`,
            2000
          ).catch(() => '')

          // Extract app name from the output or use package name as fallback
          const appName = appNameOutput
            .split('\n')
            .find(line => line.includes(packageName))
            ?.replace('package:', '')
            ?.trim() || packageName

          apps.push({
            packageName,
            appName
          })
        } catch (err) {
          console.error(`Error processing package ${packageName}:`, err)
          // If we can't get the app name, use the package name
          apps.push({
            packageName,
            appName: packageName
          })
        }
      }

      return apps.sort((a, b) => a.appName.localeCompare(b.appName))
    } catch (error) {
      console.error('Error in getInstalledApps:', error)
      return []
    }
  }

  public static async pullResponses(deviceId: string, packageName: string, filename: string): Promise<ResponseFile[]> {
    console.log(`Pulling responses for package ${packageName} from device ${deviceId} with filename ${filename}`)
    
    try {
      // Run adb root first
      console.log('Running adb root...')
      await this.runAdbCommand(`adb -s ${deviceId} root`)
      
      // Create responses directory if it doesn't exist
      const responsesDir = path.join(PROJECT_ROOT, 'src', 'responses')
      if (!fs.existsSync(responsesDir)) {
        fs.mkdirSync(responsesDir, { recursive: true })
      }

      // Pull the responses file from the device
      const remotePath = `/data/user/0/${packageName}/files/msw-responses.json`
      const localPath = path.join(responsesDir, `${filename}.json`)
      
      console.log(`Pulling from ${remotePath} to ${localPath}`)
      await this.runAdbCommand(`adb -s ${deviceId} pull ${remotePath} ${localPath}`)
      
      // Read and parse the pulled file
      if (fs.existsSync(localPath)) {
        const content = fs.readFileSync(localPath, 'utf-8')
        const data = JSON.parse(content)
        
        return [{
          filename: `${filename}.json`,
          data: data
        }]
      } else {
        console.log('No responses file found on device')
        return []
      }
    } catch (error) {
      console.error('Error pulling responses:', error)
      throw error
    }
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