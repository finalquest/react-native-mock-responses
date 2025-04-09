import React, { useState } from 'react'
import { ResponseFile } from '../types/response'
import { EditModal } from './EditModal'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

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

  const handleSaveHeaders = (newHeaders: any) => {
    const updatedEndpoint = {
      ...endpointData,
      headers: newHeaders
    }
    onUpdateEndpoint(updatedEndpoint)
  }

  return (
    <div className="p-4 h-full flex flex-col">
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
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden flex-1 flex flex-col">
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

        <div className="p-4 font-mono text-sm flex-1 flex flex-col">
          {activeTab === 'headers' ? (
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Headers
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
                    style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
                  }}
                >
                  {JSON.stringify(endpointData.headers, null, 2)}
                </SyntaxHighlighter>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute top-2 right-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Body
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
                    style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
                  }}
                >
                  {JSON.stringify(endpointData.body, null, 2)}
                </SyntaxHighlighter>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute top-2 right-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={activeTab === 'headers' ? handleSaveHeaders : handleSaveBody}
        initialBody={activeTab === 'headers' ? endpointData.headers : endpointData.body}
      />
    </div>
  )
} 