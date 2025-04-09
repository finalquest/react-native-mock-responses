import React, { useState, useEffect } from 'react'

interface DeviceSelectorProps {
  onPullResponses: (deviceId: string) => Promise<void>
  onPushResponses: (deviceId: string) => Promise<void>
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  onPullResponses,
  onPushResponses,
}) => {
  const [devices, setDevices] = useState<string[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDevices = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const connectedDevices = await window.api.getConnectedDevices()
      setDevices(connectedDevices)
      if (connectedDevices.length > 0) {
        setSelectedDevice(connectedDevices[0])
      }
    } catch (err) {
      setError('Failed to fetch devices. Make sure ADB is installed and devices are connected.')
      console.error('Error fetching devices:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const handlePull = async () => {
    if (!selectedDevice) return
    try {
      setIsLoading(true)
      setError(null)
      await onPullResponses(selectedDevice)
    } catch (err) {
      setError('Failed to pull responses')
      console.error('Error pulling responses:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePush = async () => {
    if (!selectedDevice) return
    try {
      setIsLoading(true)
      setError(null)
      await onPushResponses(selectedDevice)
    } catch (err) {
      setError('Failed to push responses')
      console.error('Error pushing responses:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Android Device</h2>
        <button
          onClick={fetchDevices}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
          disabled={isLoading}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-500">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="flex-1 bg-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || devices.length === 0}
        >
          {devices.length === 0 ? (
            <option value="">No devices found</option>
          ) : (
            devices.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))
          )}
        </select>

        <button
          onClick={handlePull}
          disabled={isLoading || !selectedDevice}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400"
        >
          Pull Responses
        </button>

        <button
          onClick={handlePush}
          disabled={isLoading || !selectedDevice}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-400"
        >
          Push Responses
        </button>
      </div>
    </div>
  )
} 