import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { ResponseFile } from '../../src/types/response';

// Get the project root directory using the current working directory
const PROJECT_ROOT = process.cwd();
const RESPONSES_DIR = path.join(PROJECT_ROOT, 'src/responses');

console.log('FileService initialized');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current working directory:', process.cwd());
console.log('Project root:', PROJECT_ROOT);
console.log('Responses directory:', RESPONSES_DIR);
console.log('Directory exists:', fs.existsSync(RESPONSES_DIR));

export class FileService {
  private static initialized = false;

  private static initialize() {
    if (this.initialized) return;
    
    console.log('FileService initialized');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Current working directory:', process.cwd());
    console.log('Project root:', PROJECT_ROOT);
    console.log('Responses directory:', RESPONSES_DIR);
    console.log('Directory exists:', fs.existsSync(RESPONSES_DIR));
    
    this.initialized = true;
  }

  static async getResponseFiles(): Promise<ResponseFile[]> {
    this.initialize();
    console.log('FileService: Looking for responses in:', RESPONSES_DIR);
    
    if (!fs.existsSync(RESPONSES_DIR)) {
      console.error('FileService: Responses directory not found:', RESPONSES_DIR);
      return [];
    }
    
    const files = fs.readdirSync(RESPONSES_DIR);
    console.log('FileService: Found files:', files);
    
    const responseFiles = files
      .filter(file => {
        const isJson = file.endsWith('.json');
        console.log(`FileService: Checking file ${file}, isJson: ${isJson}`);
        return isJson;
      })
      .map(filename => {
        console.log('FileService: Processing file:', filename);
        const filePath = path.join(RESPONSES_DIR, filename);
        console.log('FileService: Full file path:', filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        console.log('FileService: Successfully parsed file:', filename);
        return {
          filename,
          data
        };
      });

    console.log(`FileService: Processed ${responseFiles.length} response files`);
    return responseFiles;
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

    console.log('FileService: Reading file:', filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    console.log('FileService: Successfully parsed file:', filename);
    return {
      filename,
      data
    };
  }
} 