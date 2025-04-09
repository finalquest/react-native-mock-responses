import React, { useEffect, useState } from 'react'
import { ResponseFile } from './types/response'
import { FileDrawer } from './components/FileDrawer'
import { DrawerToggle } from './components/DrawerToggle'
import { EndpointList } from './components/EndpointList'
import { EndpointDetails } from './components/EndpointDetails'

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
      <FileDrawer
        isOpen={isDrawerOpen}
        responses={responses}
        selectedResponse={selectedResponse}
        onResponseClick={handleResponseClick}
      />

      <DrawerToggle isOpen={isDrawerOpen} onToggle={toggleDrawer} />

      <div className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isDrawerOpen ? 'ml-64' : 'ml-0'}
      `}>
        <h1 className="text-2xl font-bold p-4">Mock API Admin Panel</h1>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
          <EndpointList
            selectedResponse={selectedResponse}
            selectedEndpoint={selectedEndpoint}
            onEndpointClick={handleEndpointClick}
          />

          <div className="flex-1 overflow-y-auto">
            <EndpointDetails
              selectedResponse={selectedResponse}
              selectedEndpoint={selectedEndpoint}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 