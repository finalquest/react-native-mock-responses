import React, { useState } from 'react';
import { ResponseFile } from '../types/response';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { EditModal } from './EditModal';

interface StorageDetailsProps {
  selectedResponse: ResponseFile;
  isDarkMode: boolean;
  onUpdateStorage?: (updatedStorage: any) => void;
}

export const StorageDetails: React.FC<StorageDetailsProps> = ({
  selectedResponse,
  isDarkMode,
  onUpdateStorage,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!selectedResponse.storage) {
    return (
      <div
        className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
      >
        No storage data available
      </div>
    );
  }

  const handleSaveStorage = (newStorage: any) => {
    if (onUpdateStorage) {
      onUpdateStorage(newStorage);
    }
  };

  return (
    <div
      className={`p-4 h-full flex flex-col ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
    >
      <div
        className={`flex-1 flex flex-col rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}
      >
        <div className="p-4 font-mono text-sm flex-1 flex flex-col">
          <div className="flex-1 flex flex-col">
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Storage Data
            </label>
            <div className="flex-1 relative">
              <SyntaxHighlighter
                language="json"
                style={tomorrow}
                customStyle={{
                  margin: 0,
                  padding: '0.5rem',
                  height: '100%',
                  background: '#1a1a1a',
                  overflow: 'auto',
                  whiteSpace: 'pre',
                }}
                lineProps={{
                  style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' },
                }}
              >
                {JSON.stringify(selectedResponse.storage, null, 2)}
              </SyntaxHighlighter>
              {onUpdateStorage && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className={`absolute top-2 right-2 px-3 py-1 rounded ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {onUpdateStorage && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveStorage}
          initialBody={selectedResponse.storage}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};
