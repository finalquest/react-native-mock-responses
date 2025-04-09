import React, { useState, useEffect } from 'react'
import { FileDrawer } from './components/FileDrawer'
import { DrawerToggle } from './components/DrawerToggle'
import { EndpointList } from './components/EndpointList'
import { EndpointDetails } from './components/EndpointDetails'
import { DeviceSelector } from './components/DeviceSelector'
import { InstalledApps } from './components/InstalledApps'
import { ResponseFile } from './types/response'

declare global {
  interface Window {
    api: {
      getResponseFiles(): Promise<ResponseFile[]>
      getResponseFile(filename: string): Promise<ResponseFile | null>
      saveResponseFile(data: { filename: string; data: Record<string, any> }): Promise<void>
      getConnectedDevices(): Promise<string[]>
      pullResponses(deviceId: string): Promise<ResponseFile[]>
      pushResponses(deviceId: string): Promise<void>
      restartApp(deviceId: string): Promise<void>
      getInstalledApps(deviceId: string): Promise<{ packageName: string; appName: string }[]>
    }
  }
}

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [responses, setResponses] = useState<ResponseFile[]>([])
  const [selectedResponse, setSelectedResponse] = useState<ResponseFile | null>(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const result = await window.api.getResponseFiles()
        setResponses(result)
      } catch (error) {
        console.error('Error fetching responses:', error)
      }
    }
    fetchResponses()
  }, [])

  const handleResponseClick = (filename: string) => {
    const response = responses.find(r => r.filename === filename)
    setSelectedResponse(response || null)
    setSelectedEndpoint(null)
  }

  const handleEndpointClick = (endpoint: string) => {
    setSelectedEndpoint(endpoint)
  }

  const handleUpdateEndpoint = async (updatedEndpoint: any) => {
    if (!selectedResponse || !selectedEndpoint) return

    const updatedResponse = {
      ...selectedResponse,
      data: {
        ...selectedResponse.data,
        [selectedEndpoint]: updatedEndpoint
      }
    }

    try {
      await window.api.saveResponseFile({
        filename: selectedResponse.filename,
        data: updatedResponse.data
      })
      setSelectedResponse(updatedResponse)
      setResponses(prevResponses =>
        prevResponses.map(response =>
          response.filename === selectedResponse.filename ? updatedResponse : response
        )
      )
    } catch (error) {
      console.error('Error updating endpoint:', error)
    }
  }

  const handlePullResponses = async (deviceId: string) => {
    try {
      const updatedResponses = await window.api.pullResponses(deviceId)
      setResponses(updatedResponses)
      setSelectedResponse(null)
      setSelectedEndpoint(null)
    } catch (error) {
      console.error('Error pulling responses:', error)
    }
  }

  const handlePushResponses = async (deviceId: string) => {
    try {
      await window.api.pushResponses(deviceId)
      await window.api.restartApp(deviceId)
    } catch (error) {
      console.error('Error pushing responses:', error)
    }
  }

  return (
    <div className="flex h-screen bg-black">
      <FileDrawer
        isOpen={isDrawerOpen}
        responses={responses}
        selectedResponse={selectedResponse}
        onResponseClick={handleResponseClick}
      />
      <div className="flex-1 flex flex-col">
            <DrawerToggle
              isOpen={isDrawerOpen}
              onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
            />
            <DeviceSelector
              onPullResponses={handlePullResponses}
              onPushResponses={handlePushResponses}
            />
          <div className="mt-2">
            <InstalledApps />
          </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
            {selectedResponse && (
              <EndpointList
                selectedResponse={selectedResponse}
                selectedEndpoint={selectedEndpoint}
                onEndpointClick={handleEndpointClick}
              />
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {selectedResponse && selectedEndpoint && (
              <EndpointDetails
                selectedResponse={selectedResponse}
                selectedEndpoint={selectedEndpoint}
                onUpdateEndpoint={handleUpdateEndpoint}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 