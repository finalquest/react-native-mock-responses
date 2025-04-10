import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { ResponseFile } from '../../src/types/response';

// Get the project root directory using app.getAppPath()
const PROJECT_ROOT = app.getAppPath();
const RESPONSES_DIR = path.join(PROJECT_ROOT, 'src', 'responses');

console.log('FileService initialized');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('App path:', PROJECT_ROOT);
console.log('Responses directory:', RESPONSES_DIR);
console.log('Directory exists:', fs.existsSync(RESPONSES_DIR));

export class FileService {
  private static initialized = false;

  private static initialize() {
    if (this.initialized) return;

    console.log('FileService initialized');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('App path:', PROJECT_ROOT);
    console.log('Responses directory:', RESPONSES_DIR);
    console.log('Directory exists:', fs.existsSync(RESPONSES_DIR));

    this.initialized = true;
  }

  public static getResponseFiles(): ResponseFile[] {
    this.initialize();

    try {
      console.log('Getting response files from:', RESPONSES_DIR);

      if (!fs.existsSync(RESPONSES_DIR)) {
        console.error('Responses directory does not exist:', RESPONSES_DIR);
        return [];
      }

      const files = fs.readdirSync(RESPONSES_DIR);
      console.log('Found files in directory:', files);

      const responseFiles = files
        .filter((file) => {
          const isJson = file.endsWith('.json');
          console.log(`File ${file} is JSON:`, isJson);
          return isJson;
        })
        .map((file) => {
          try {
            const filePath = path.join(RESPONSES_DIR, file);
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
    const filePath = path.join(RESPONSES_DIR, filename);
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
    const filePath = path.join(RESPONSES_DIR, filename);
    console.log('FileService: Full file path:', filePath);

    try {
      const content = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('FileService: File saved successfully');
    } catch (err) {
      console.error('FileService: Error saving file:', err);
      throw err;
    }
  }
}
