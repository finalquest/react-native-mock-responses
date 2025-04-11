export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
}
export interface StorageData {
  [key: string]: any;
}
export interface ResponseFile {
  filename: string;
  data: Record<string, ResponseData>;
  storage?: StorageData;
  hasStorage?: boolean;
}
