import React from 'react'
import { ResponseFile } from '../types/response'

interface EndpointDetailsProps {
  selectedResponse: ResponseFile | null
  selectedEndpoint: string | null
}

export const EndpointDetails: React.FC<EndpointDetailsProps> = ({
  selectedResponse,
  selectedEndpoint,
}) => {
  if (!selectedEndpoint || !selectedResponse) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select an endpoint from the left to view details
      </div>
    )
  }

  const endpointData = selectedResponse.data[selectedEndpoint]

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-mono">
          GET {selectedEndpoint.split(' ')[1]}
        </h2>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded ${
            endpointData.status >= 400 ? 'bg-red-500' : 'bg-green-500'
          }`}>
            Status: {endpointData.status}
          </span>
          <button className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
            Edit
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="border-b border-gray-800">
          <button className="px-4 py-2 bg-gray-800 text-white">Headers</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white">Body</button>
        </div>

        <div className="p-4 font-mono text-sm">
          {Object.entries(endpointData.headers).map(([key, value]) => (
            <div key={key} className="py-1">
              <span className="text-gray-400">{key}:</span>{' '}
              <span>{value as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 