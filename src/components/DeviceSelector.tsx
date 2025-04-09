import React, { useState, useEffect } from 'react'

interface DeviceSelectorProps {
  onDeviceSelect: (deviceId: string) => void
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  onDeviceSelect
}) => {
  const [devices, setDevices] = useState<string[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const result = await window.api.getConnectedDevices()
        setDevices(result)
        if (result.length > 0) {
          setSelectedDevice(result[0])
          onDeviceSelect(result[0])
        }
      } catch (error) {
        console.error('Error fetching devices:', error)
      }
    }

    fetchDevices()
  }, [onDeviceSelect])

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId)
    setIsOpen(false)
    onDeviceSelect(deviceId)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
      >
        <span className="text-gray-400">Device:</span>
        <div className="flex items-center gap-2">
          <span>{selectedDevice || 'Select a device'}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
          <div className="p-2 max-h-96 overflow-y-auto">
            <div className="space-y-1">
              {devices.map((device) => (
                <div
                  key={device}
                  onClick={() => handleDeviceSelect(device)}
                  className={`p-2 hover:bg-gray-700 rounded cursor-pointer ${
                    selectedDevice === device ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="font-medium text-white text-sm">{device}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 