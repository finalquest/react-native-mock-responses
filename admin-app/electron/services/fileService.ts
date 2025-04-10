import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { ResponseFile } from '../../src/types/response';

// Get the project root directory using app.getAppPath()
const PROJECT_ROOT = app.getAppPath();
const RESPONSES_DIR = path.join(PROJECT_ROOT, 'src', 'responses');
const USER_DATA_DIR = path.join(app.getPath('userData'), 'admin-responses');
const CONFIG_FILE = path.join(USER_DATA_DIR, 'config.json');

// Initialize the service
function initializeFileService() {
  console.log('Initializing FileService...');
  console.log('USER_DATA_DIR:', USER_DATA_DIR);
  console.log('CONFIG_FILE:', CONFIG_FILE);

  // Ensure user data directory exists
  if (!fs.existsSync(USER_DATA_DIR)) {
    console.log('Creating user data directory:', USER_DATA_DIR);
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  }

  // Initialize config file if it doesn't exist
  if (!fs.existsSync(CONFIG_FILE)) {
    console.log('Creating config file:', CONFIG_FILE);
    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify({ savePath: RESPONSES_DIR }, null, 2)
    );
  }

  // Ensure the save path directory exists
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  if (!fs.existsSync(config.savePath)) {
    console.log('Creating save path directory:', config.savePath);
    fs.mkdirSync(config.savePath, { recursive: true });
  }

  console.log('FileService initialized');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('App path:', PROJECT_ROOT);
  console.log('User data directory:', USER_DATA_DIR);
  console.log('Responses directory:', RESPONSES_DIR);
  console.log('Config file:', CONFIG_FILE);
  console.log('Current save path:', config.savePath);
}

// Initialize immediately
initializeFileService();

export class FileService {
  private static initialized = false;

  private static initialize() {
    if (this.initialized) return;
    this.initialized = true;
  }

  public static setSavePath(savePath: string): void {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    config.savePath = savePath;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

    // Ensure the new save path directory exists
    if (!fs.existsSync(savePath)) {
      console.log('Creating new save path directory:', savePath);
      fs.mkdirSync(savePath, { recursive: true });
    }
  }

  public static getSavePath(): string {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    return config.savePath;
  }

  public static getResponseFiles(): ResponseFile[] {
    this.initialize();

    try {
      const directory = this.getSavePath();
      console.log('Getting response files from:', directory);

      if (!fs.existsSync(directory)) {
        console.error('Responses directory does not exist:', directory);
        return [];
      }

      const files = fs.readdirSync(directory);
      console.log('Found files in directory:', files);

      const responseFiles = files
        .filter((file) => {
          const isJson = file.endsWith('.json');
          console.log(`File ${file} is JSON:`, isJson);
          return isJson;
        })
        .map((file) => {
          try {
            const filePath = path.join(directory, file);
            console.log(`Reading file: ${filePath}`);
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            console.log(`Successfully parsed file: ${file}`);
            return {
              filename: file,
              data: data,
            };
          } catch (error) {
            console.error(`Error reading file ${file}:`, error);
            return null;
          }
        })
        .filter((file): file is ResponseFile => file !== null);

      console.log('Processed response files:', responseFiles);
      return responseFiles;
    } catch (error) {
      console.error('Error in getResponseFiles:', error);
      return [];
    }
  }

  static async getResponseFile(filename: string): Promise<ResponseFile | null> {
    this.initialize();
    console.log('FileService: Getting response file:', filename);
    const directory = this.getSavePath();
    const filePath = path.join(directory, filename);
    console.log('FileService: Full file path:', filePath);

    if (!fs.existsSync(filePath)) {
      console.error('FileService: File not found:', filePath);
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      return { filename, data };
    } catch (err) {
      console.error('FileService: Error reading file:', err);
      return null;
    }
  }

  static async saveResponseFile(
    filename: string,
    data: Record<string, any>
  ): Promise<void> {
    this.initialize();
    console.log('FileService: Saving response file:', filename);
    const directory = this.getSavePath();
    const filePath = path.join(directory, filename);
    console.log('FileService: Full file path:', filePath);

    try {
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      const content = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('FileService: File saved successfully');
    } catch (err) {
      console.error('FileService: Error saving file:', err);
      throw err;
    }
  }
}
