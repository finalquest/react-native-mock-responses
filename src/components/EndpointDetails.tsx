import React, { useState } from 'react'
import { ResponseFile } from '../types/response'
import { EditModal } from './EditModal'

interface EndpointDetailsProps {
  selectedResponse: ResponseFile | null
  selectedEndpoint: string | null
  onUpdateEndpoint: (updatedEndpoint: any) => void
}

export const EndpointDetails: React.FC<EndpointDetailsProps> = ({
  selectedResponse,
  selectedEndpoint,
  onUpdateEndpoint,
}) => {
  const [activeTab, setActiveTab] = useState<'headers' | 'body'>('headers')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (!selectedEndpoint || !selectedResponse) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select an endpoint from the left to view details
      </div>
    )
  }

  const endpointData = selectedResponse.data[selectedEndpoint]
  if (!endpointData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data found for this endpoint
      </div>
    )
  }

  const handleSaveBody = (newBody: any) => {
    const updatedEndpoint = {
      ...endpointData,
      body: newBody
    }
    onUpdateEndpoint(updatedEndpoint)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-mono">
          {selectedEndpoint}
        </h2>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded ${
            endpointData.status >= 400 ? 'bg-red-500' : 'bg-green-500'
          }`}>
            Status: {endpointData.status}
          </span>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="border-b border-gray-800">
          <button 
            onClick={() => setActiveTab('headers')}
            className={`px-4 py-2 ${
              activeTab === 'headers' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Headers
          </button>
          <button 
            onClick={() => setActiveTab('body')}
            className={`px-4 py-2 ${
              activeTab === 'body' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Body
          </button>
        </div>

        <div className="p-4 font-mono text-sm">
          {activeTab === 'headers' ? (
            Object.entries(endpointData.headers).map(([key, value]) => (
              <div key={key} className="py-1">
                <span className="text-gray-400">{key}:</span>{' '}
                <span>{value as string}</span>
              </div>
            ))
          ) : (
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(endpointData.body, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveBody}
        initialBody={endpointData.body}
      />
    </div>
  )
} 