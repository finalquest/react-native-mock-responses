import React from 'react'
import { ResponseFile } from '../types/response'

interface EndpointListProps {
  selectedResponse: ResponseFile | null
  selectedEndpoint: string | null
  onEndpointClick: (endpoint: string) => void
}

export const EndpointList: React.FC<EndpointListProps> = ({
  selectedResponse,
  selectedEndpoint,
  onEndpointClick,
}) => {
  return (
    <div className="lg:w-96 border-r border-gray-800 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl mb-2">Endpoints</h2>
        <p className="text-gray-400 mb-4">Select an endpoint to view or edit</p>

        <div className="space-y-2">
          {selectedResponse && Object.entries(selectedResponse.data).map(([endpoint, data]) => {
            const [method, path] = endpoint.split(' ')
            const statusCode = data.status
            const statusClass = statusCode >= 400 ? 'bg-red-500' : 'bg-green-500'
            
            return (
              <div
                key={endpoint}
                onClick={() => onEndpointClick(endpoint)}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                  selectedEndpoint === endpoint ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <span className={`px-2 py-1 rounded text-sm ${statusClass}`}>{statusCode}</span>
                <span className="font-mono">{method}</span>
                <span className="font-mono text-gray-400 truncate">{path}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 