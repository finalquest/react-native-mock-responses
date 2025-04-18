import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ResponseFile } from '../types/response';

interface EndpointsPanelProps {
  selectedResponse: ResponseFile | null;
  selectedEndpoint: string | null;
  onEndpointClick: (endpoint: string) => void;
  isDarkMode: boolean;
  activeTab: 'responses' | 'storage';
  onTabChange: (tab: 'responses' | 'storage') => void;
}

export const EndpointsPanel: React.FC<EndpointsPanelProps> = ({
  selectedResponse,
  selectedEndpoint,
  onEndpointClick,
  isDarkMode,
  activeTab,
  onTabChange,
}) => {
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
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
    return Object.entries(selectedResponse.data).map(([endpoint]) => (
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
    ));
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
        <h2
          className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
        >
          {activeTab === 'responses' ? 'Endpoints' : 'Storage Data'}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
        onMouseDown={startResizing}
      />
    </div>
  );
};
