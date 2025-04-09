import React from 'react'
import { ResponseFile } from '../types/response'
import { EndpointDetails } from './EndpointDetails'

interface MainPanelProps {
  selectedResponse: ResponseFile | null
  selectedEndpoint: string | null
  onEndpointClick: (endpoint: string) => void
  onUpdateEndpoint: (updatedEndpoint: any) => void
}

export const MainPanel: React.FC<MainPanelProps> = ({
  selectedResponse,
  selectedEndpoint,
  onEndpointClick,
  onUpdateEndpoint,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {selectedResponse && selectedEndpoint && (
          <EndpointDetails
            selectedResponse={selectedResponse}
            selectedEndpoint={selectedEndpoint}
            onUpdateEndpoint={onUpdateEndpoint}
          />
        )}
      </div>
    </div>
  )
} 