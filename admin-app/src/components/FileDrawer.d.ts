import React from 'react';
import { ResponseFile } from '../types/response';
interface FileDrawerProps {
  isOpen: boolean;
  responses: ResponseFile[];
  selectedResponse: ResponseFile | null;
  onResponseClick: (filename: string) => void;
  isDarkMode: boolean;
  activeTab: 'responses' | 'storage';
  onTabChange: (tab: 'responses' | 'storage') => void;
}
export declare const FileDrawer: React.FC<FileDrawerProps>;
export {};
