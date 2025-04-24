import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ResponseFile } from '../types/response';
import { CreateEndpointModal } from './CreateEndpointModal';

interface EndpointsPanelProps {
  selectedResponse: ResponseFile | null;
  selectedEndpoint: string | null;
  onEndpointClick: (endpoint: string) => void;
  isDarkMode: boolean;
  activeTab: 'responses' | 'storage';
  onTabChange: (tab: 'responses' | 'storage') => void;
  onUpdateEndpoint: (endpointKey: string, endpointData: any) => void;
}

export const EndpointsPanel: React.FC<EndpointsPanelProps> = ({
  selectedResponse,
  selectedEndpoint,
  onEndpointClick,
  isDarkMode,
  activeTab,
  onTabChange,
  onUpdateEndpoint,
}) => {
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing && panelRef.current) {
        const newWidth =
          e.clientX - panelRef.current.getBoundingClientRect().left;
        if (newWidth >= 200 && newWidth <= 500) {
          setWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize]);

  const handleCreateEndpoint = (endpointData: {
    path: string;
    method: string;
    status: number;
    headers: Record<string, string>;
    body: any;
  }) => {
    if (!selectedResponse) return;

    const endpointKey = `${endpointData.method} ${endpointData.path}`;
    const newEndpoint = {
      status: endpointData.status,
      headers: endpointData.headers,
      body: endpointData.body,
    };

    onUpdateEndpoint(endpointKey, newEndpoint);
  };

  if (!selectedResponse) {
    return (
      <div
        className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
      >
        Select a response file to view endpoints
      </div>
    );
  }

  const renderContent = () => {
    return (
      <div className="space-y-2">
        {Object.entries(selectedResponse.data).map(([endpoint]) => (
          <div
            key={endpoint}
            className={`p-2 rounded cursor-pointer ${
              selectedEndpoint === endpoint
                ? isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-gray-900'
                : isDarkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
            }`}
            onClick={() => onEndpointClick(endpoint)}
          >
            <div className="truncate" title={endpoint}>
              {endpoint}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={panelRef}
      className={`flex flex-col border-r ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'} relative`}
      style={{ width: `${width}px` }}
    >
      <div
        className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="flex space-x-2 mb-2">
          <button
            className={`px-3 py-1 rounded ${
              activeTab === 'responses'
                ? isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-gray-900'
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onTabChange('responses')}
          >
            Endpoints
          </button>
          <button
            className={`px-3 py-1 rounded ${
              activeTab === 'storage'
                ? isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-gray-900'
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onTabChange('storage')}
          >
            Storage
          </button>
        </div>
        <div className="flex items-center justify-between">
          <h2
            className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
          >
            {activeTab === 'responses' ? 'Endpoints' : 'Storage Data'}
          </h2>
          {activeTab === 'responses' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={`p-1 rounded ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
              title="Add new endpoint"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
        onMouseDown={startResizing}
      />

      <CreateEndpointModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateEndpoint}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
