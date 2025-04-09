import React from 'react'
import { ResponseFile } from '../types/response'

interface FileDrawerProps {
  isOpen: boolean
  responses: ResponseFile[]
  selectedResponse: ResponseFile | null
  onResponseClick: (filename: string) => void
}

export const FileDrawer: React.FC<FileDrawerProps> = ({
  isOpen,
  responses,
  selectedResponse,
  onResponseClick,
}) => {
  return (
    <div 
      className={`
        fixed top-0 bottom-0 left-0 bg-black border-r border-gray-800
        transition-all duration-300 ease-in-out z-10 overflow-hidden
        ${isOpen ? 'w-64' : 'w-0'}
      `}
    >
      <div className={`
        h-full w-64 p-4
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <h2 className="text-xl font-bold mb-2">Response Files</h2>
        <div className="space-y-1">
          {responses.map((response) => (
            <div
              key={response.filename}
              onClick={() => onResponseClick(response.filename)}
              className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                selectedResponse?.filename === response.filename 
                  ? 'bg-gray-800' 
                  : 'hover:bg-gray-800'
              }`}
            >
              <span className="font-mono text-sm truncate">{response.filename}</span>
              <span className="text-xs text-gray-400 ml-2 shrink-0">
                {Object.keys(response.data).length} endpoints
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 