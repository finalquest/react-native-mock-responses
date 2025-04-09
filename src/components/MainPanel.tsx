import React from 'react'
import { ResponseFile } from '../types/response'
import { EndpointDetails } from './EndpointDetails'

interface MainPanelProps {
  selectedResponse: ResponseFile | null
  selectedEndpoint: string | null
  onEndpointClick: (endpoint: string) => void
  onUpdateEndpoint: (updatedEndpoint: any) => void
  isDarkMode: boolean
}

export const MainPanel: React.FC<MainPanelProps> = ({
  selectedResponse,
  selectedEndpoint,
  onEndpointClick,
  onUpdateEndpoint,
  isDarkMode
}) => {
  if (!selectedResponse) {
    return (
      <div className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Select a response file to view details
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="font-semibold">Response Details</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <EndpointDetails
          selectedResponse={selectedResponse}
          selectedEndpoint={selectedEndpoint}
          onUpdateEndpoint={onUpdateEndpoint}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  )
} 