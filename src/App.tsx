import React, { useEffect, useState } from 'react'
import { ResponseFile } from './types/response'

declare global {
  interface Window {
    api: {
      getResponseFiles: () => Promise<ResponseFile[]>
      getResponseFile: (filename: string) => Promise<ResponseFile | null>
    }
  }
}

function App() {
  const [responses, setResponses] = useState<ResponseFile[]>([])
  const [selectedResponse, setSelectedResponse] = useState<ResponseFile | null>(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)

  useEffect(() => {
    const loadResponses = async () => {
      try {
        const files = await window.api.getResponseFiles()
        if (files.length > 0) {
          setResponses(files)
          setSelectedResponse(files[0])
        }
      } catch (error) {
        console.error('Error loading responses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadResponses()
  }, [])

  const handleResponseClick = async (filename: string) => {
    try {
      const response = await window.api.getResponseFile(filename)
      if (response) {
        setSelectedResponse(response)
        setSelectedEndpoint(null)
      }
    } catch (error) {
      console.error('Error loading response:', error)
    }
  }

  const handleEndpointClick = (endpoint: string) => {
    setSelectedEndpoint(endpoint)
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Drawer - Response Files */}
      <div 
        className={`
          fixed top-0 bottom-0 left-0 bg-black border-r border-gray-800
          transition-all duration-300 ease-in-out z-10 overflow-hidden
          ${isDrawerOpen ? 'w-64' : 'w-0'}
        `}
      >
        <div className={`
          h-full w-64 p-4
          transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <h2 className="text-xl font-bold mb-2">Response Files</h2>
          <div className="space-y-1">
            {responses.map((response) => (
              <div
                key={response.filename}
                onClick={() => handleResponseClick(response.filename)}
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

      {/* Toggle Drawer Button */}
      <button
        onClick={toggleDrawer}
        className={`
          fixed top-4 left-0 z-20 p-2 bg-gray-800 hover:bg-gray-700
          rounded-r transition-all duration-300 ease-in-out
          ${isDrawerOpen ? 'left-64' : 'left-0'}
        `}
      >
        {isDrawerOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Main Content */}
      <div className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isDrawerOpen ? 'ml-64' : 'ml-0'}
      `}>
        <h1 className="text-2xl font-bold p-4">Mock API Admin Panel</h1>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
          {/* Endpoints List Panel */}
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
                      onClick={() => handleEndpointClick(endpoint)}
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

          {/* Endpoint Details Panel */}
          <div className="flex-1 overflow-y-auto">
            {selectedEndpoint && selectedResponse ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-mono">
                    GET {selectedEndpoint.split(' ')[1]}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded ${
                      selectedResponse.data[selectedEndpoint].status >= 400 ? 'bg-red-500' : 'bg-green-500'
                    }`}>
                      Status: {selectedResponse.data[selectedEndpoint].status}
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
                    {Object.entries(selectedResponse.data[selectedEndpoint].headers).map(([key, value]) => (
                      <div key={key} className="py-1">
                        <span className="text-gray-400">{key}:</span>{' '}
                        <span>{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select an endpoint from the left to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 