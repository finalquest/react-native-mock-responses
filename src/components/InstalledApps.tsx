import React, { useState, useEffect } from 'react'

interface InstalledApp {
  packageName: string
  appName: string
}

interface InstalledAppsProps {
  deviceId: string | null
  onAppSelect: (app: InstalledApp) => void
}

export const InstalledApps: React.FC<InstalledAppsProps> = ({ deviceId, onAppSelect }) => {
  const [apps, setApps] = useState<InstalledApp[]>([])
  const [selectedApp, setSelectedApp] = useState<InstalledApp | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchApps = async () => {
      if (!deviceId) {
        setApps([])
        setSelectedApp(null)
        return
      }

      setIsLoading(true)
      try {
        const result = await window.api.getInstalledApps(deviceId)
        setApps(result)
      } catch (error) {
        console.error('Error fetching installed apps:', error)
        setApps([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchApps()
  }, [deviceId]) // Only fetch when deviceId changes

  const handleAppSelect = (app: InstalledApp) => {
    setSelectedApp(app)
    setIsOpen(false)
    onAppSelect(app)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
        disabled={!deviceId || isLoading}
      >
        <span className="text-gray-400">Selected App:</span>
        <div className="flex items-center gap-2">
          <span>{isLoading ? 'Loading...' : (selectedApp?.appName || 'Select an app')}</span>
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
              {apps.map((app) => (
                <div
                  key={app.packageName}
                  onClick={() => handleAppSelect(app)}
                  className={`p-2 hover:bg-gray-700 rounded cursor-pointer ${
                    selectedApp?.packageName === app.packageName ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="font-medium text-white text-sm">{app.appName}</div>
                  <div className="text-xs text-gray-400 truncate">{app.packageName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 