import React, { useState, useRef, useCallback } from 'react';
import { ResponseFile } from '../types/response';

interface FileDrawerProps {
  isOpen: boolean;
  responses: ResponseFile[];
  selectedResponse: ResponseFile | null;
  onResponseClick: (filename: string) => void;
  isDarkMode: boolean;
  activeTab: 'responses' | 'storage';
  onTabChange: (tab: 'responses' | 'storage') => void;
  onRefresh: () => void;
}

export const FileDrawer: React.FC<FileDrawerProps> = ({
  isOpen,
  responses,
  selectedResponse,
  onResponseClick,
  isDarkMode,
  activeTab,
  onTabChange,
  onRefresh,
}) => {
  const [width, setWidth] = useState(256); // 64 * 4 (default w-64)
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const delta = e.clientX - startX.current;
    const newWidth = Math.max(200, Math.min(500, startWidth.current + delta));
    setWidth(newWidth);
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  }, [handleMouseMove]);

  const startResizing = useCallback(
    (e: React.MouseEvent) => {
      isResizing.current = true;
      startX.current = e.clientX;
      startWidth.current = width;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResizing);
    },
    [width, handleMouseMove, stopResizing]
  );

  const handleOpenFolder = async () => {
    try {
      await window.api.openFileExplorer();
    } catch (error) {
      console.error('Error opening file explorer:', error);
    }
  };

  return (
    <div
      className={`
        fixed top-0 bottom-0 left-0 transition-all duration-300 ease-in-out z-10 overflow-hidden
        ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
        ${isOpen ? 'w-64' : 'w-0'}
      `}
      style={{ width: isOpen ? `${width}px` : '0' }}
    >
      <div
        className={`
        h-full p-4
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between mb-2">
          <h2
            className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
          >
            Response Files
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-1 rounded hover:bg-gray-700 transition-colors"
              title="Refresh files"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <button
              onClick={handleOpenFolder}
              className="p-1 rounded hover:bg-gray-700 transition-colors"
              title="Open folder in file explorer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`flex mb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <button
            onClick={() => onTabChange('responses')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'responses'
                ? isDarkMode
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-blue-600 border-b-2 border-blue-600'
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Responses
          </button>
          <button
            onClick={() => onTabChange('storage')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'storage'
                ? isDarkMode
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-blue-600 border-b-2 border-blue-600'
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Storage
          </button>
        </div>

        <div className="space-y-1">
          {responses.map((response) => (
            <div
              key={response.filename}
              onClick={() => onResponseClick(response.filename)}
              className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                selectedResponse?.filename === response.filename
                  ? isDarkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
                  : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
              }`}
            >
              <span
                className={`font-mono text-sm truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
              >
                {response.filename}
              </span>
              <span
                className={`text-xs ml-2 shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {activeTab === 'responses'
                  ? `${Object.keys(response.data).length} endpoints`
                  : response.storage
                    ? 'Has storage'
                    : 'No storage'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
        onMouseDown={startResizing}
      />
    </div>
  );
};
