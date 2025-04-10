import React from 'react'
import { ResponseFile } from '../types/response'

interface FileDrawerProps {
  isOpen: boolean
  responses: ResponseFile[]
  selectedResponse: ResponseFile | null
  onResponseClick: (filename: string) => void
  isDarkMode: boolean
}

export const FileDrawer: React.FC<FileDrawerProps> = ({
  isOpen,
  responses,
  selectedResponse,
  onResponseClick,
  isDarkMode,
}) => {
  return (
    <div 
      className={`
        fixed top-0 bottom-0 left-0 transition-all duration-300 ease-in-out z-10 overflow-hidden
        ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
        ${isOpen ? 'w-64' : 'w-0'}
      `}
    >
      <div className={`
        h-full w-64 p-4
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Response Files
        </h2>
        <div className="space-y-1">
          {responses.map((response) => (
            <div
              key={response.filename}
              onClick={() => onResponseClick(response.filename)}
              className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                selectedResponse?.filename === response.filename 
                  ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <span className={`font-mono text-sm truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {response.filename}
              </span>
              <span className={`text-xs ml-2 shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {Object.keys(response.data).length} endpoints
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 