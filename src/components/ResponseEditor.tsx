import React from 'react'
import { ResponseFile } from '../types/response'
import { EndpointsPanel } from './EndpointsPanel'
import { MainPanel } from './MainPanel'

interface ResponseEditorProps {
  selectedResponse: ResponseFile | null
  selectedEndpoint: string | null
  onEndpointClick: (endpoint: string) => void
  onUpdateEndpoint: (updatedEndpoint: any) => void
}

export const ResponseEditor: React.FC<ResponseEditorProps> = ({
  selectedResponse,
  selectedEndpoint,
  onEndpointClick,
  onUpdateEndpoint,
}) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      <EndpointsPanel
        selectedResponse={selectedResponse}
        selectedEndpoint={selectedEndpoint}
        onEndpointClick={onEndpointClick}
      />
      <MainPanel
        selectedResponse={selectedResponse}
        selectedEndpoint={selectedEndpoint}
        onUpdateEndpoint={onUpdateEndpoint}
      />
    </div>
  )
} 