import React, { useState, useEffect, useRef } from 'react'
import { FileDrawer } from './components/FileDrawer'
import { DrawerToggle } from './components/DrawerToggle'
import { EndpointList } from './components/EndpointList'
import { EndpointDetails } from './components/EndpointDetails'
import { DeviceSelector } from './components/DeviceSelector'
import { InstalledApps } from './components/InstalledApps'
import { ResponseActions } from './components/ResponseActions'
import { EndpointsPanel } from './components/EndpointsPanel'
import { ResponseFile } from './types/response'

declare global {
  interface Window {
    api: {
      getResponseFiles(): Promise<ResponseFile[]>
      getResponseFile(filename: string): Promise<ResponseFile | null>
      saveResponseFile(data: { filename: string; data: Record<string, any> }): Promise<void>
      getConnectedDevices(): Promise<string[]>
      pullResponses(deviceId: string, packageName: string, filename: string): Promise<ResponseFile[]>
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
  const [selectedApp, setSelectedApp] = useState<{ packageName: string; appName: string } | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [endpointPanelWidth, setEndpointPanelWidth] = useState(300)
  const [isResizing, setIsResizing] = useState(false)
  const endpointPanelRef = useRef<HTMLDivElement>(null)

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

  const handlePullResponses = async (deviceId: string, packageName: string, filename: string) => {
    try {
      await window.api.pullResponses(deviceId, packageName, filename)
      // Fetch all response files after pulling
      const allResponses = await window.api.getResponseFiles()
      setResponses(allResponses)
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

  const handleAppSelect = (app: { packageName: string; appName: string }) => {
    setSelectedApp(app)
  }

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId)
  }

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const stopResizing = () => {
    setIsResizing(false)
  }

  const resize = (e: MouseEvent) => {
    if (isResizing && endpointPanelRef.current) {
      const newWidth = e.clientX - endpointPanelRef.current.getBoundingClientRect().left
      if (newWidth >= 200 && newWidth <= 500) {
        setEndpointPanelWidth(newWidth)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResizing)
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing])

  return (
    <div className="flex h-screen bg-black">
      <FileDrawer
        isOpen={isDrawerOpen}
        responses={responses}
        selectedResponse={selectedResponse}
        onResponseClick={handleResponseClick}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <DrawerToggle
              isOpen={isDrawerOpen}
              onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
            />
            <div className="flex items-center gap-4">
              <DeviceSelector onDeviceSelect={handleDeviceSelect} />
              <InstalledApps deviceId={selectedDevice} onAppSelect={handleAppSelect} />
              <ResponseActions
                deviceId={selectedDevice}
                selectedApp={selectedApp}
                onPullResponses={handlePullResponses}
                onPushResponses={handlePushResponses}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <EndpointsPanel
            selectedResponse={selectedResponse}
            selectedEndpoint={selectedEndpoint}
            onEndpointClick={setSelectedEndpoint}
          />
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