import React from 'react';
import { ResponseFile } from '../types/response';
import { EndpointDetails } from './EndpointDetails';
import { StorageDetails } from './StorageDetails';

interface MainPanelProps {
  selectedResponse: ResponseFile | null;
  selectedEndpoint: string | null;
  onUpdateEndpoint: (endpointKey: string, endpointData: any) => void;
  isDarkMode: boolean;
  activeTab: 'responses' | 'storage';
  onUpdateStorage?: (updatedStorage: any) => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({
  selectedResponse,
  selectedEndpoint,
  onUpdateEndpoint,
  isDarkMode,
  activeTab,
  onUpdateStorage,
}) => {
  if (!selectedResponse) {
    return (
      <div
        className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
      >
        Select a response file to view details
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div
        className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <h2 className="font-semibold">
          {activeTab === 'responses' ? 'Response Details' : 'Storage Data'}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'responses' ? (
          <EndpointDetails
            selectedResponse={selectedResponse}
            selectedEndpoint={selectedEndpoint}
            onUpdateEndpoint={onUpdateEndpoint}
            isDarkMode={isDarkMode}
          />
        ) : (
          <StorageDetails
            selectedResponse={selectedResponse}
            isDarkMode={isDarkMode}
            onUpdateStorage={onUpdateStorage}
          />
        )}
      </div>
    </div>
  );
};
