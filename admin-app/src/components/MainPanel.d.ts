import React from 'react';
import { ResponseFile } from '../types/response';
interface MainPanelProps {
  selectedResponse: ResponseFile | null;
  selectedEndpoint: string | null;
  onUpdateEndpoint: (updatedEndpoint: any) => void;
  isDarkMode: boolean;
  activeTab: 'responses' | 'storage';
  onUpdateStorage?: (updatedStorage: any) => void;
}
export declare const MainPanel: React.FC<MainPanelProps>;
export {};
