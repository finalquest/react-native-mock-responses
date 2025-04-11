import React from 'react';
import { ResponseFile } from '../types/response';
interface StorageDetailsProps {
  selectedResponse: ResponseFile;
  isDarkMode: boolean;
  onUpdateStorage?: (updatedStorage: any) => void;
}
export declare const StorageDetails: React.FC<StorageDetailsProps>;
export {};
