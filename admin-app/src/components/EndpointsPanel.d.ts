import React from 'react';
import { ResponseFile } from '../types/response';
interface EndpointsPanelProps {
  selectedResponse: ResponseFile | null;
  selectedEndpoint: string | null;
  onEndpointClick: (endpoint: string) => void;
  isDarkMode: boolean;
  activeTab: 'responses' | 'storage';
  onTabChange: (tab: 'responses' | 'storage') => void;
}
export declare const EndpointsPanel: React.FC<EndpointsPanelProps>;
export {};
