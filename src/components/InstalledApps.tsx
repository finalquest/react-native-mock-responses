import React, { useState, useEffect, useRef } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'

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
  const [isOpen, setIsOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<InstalledApp | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setIsOpen(false))

  useEffect(() => {
    const fetchApps = async () => {
      if (!deviceId) return
      try {
        const result = await window.api.getInstalledApps(deviceId)
        setApps(result)
      } catch (error) {
        console.error('Error fetching apps:', error)
      }
    }
    fetchApps()
  }, [deviceId])

  const handleAppSelect = (app: InstalledApp) => {
    setSelectedApp(app)
    onAppSelect(app)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        disabled={!deviceId}
      >
        <span>{selectedApp?.appName || 'Select App'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded shadow-lg z-10">
          {apps.map((app) => (
            <button
              key={app.packageName}
              onClick={() => handleAppSelect(app)}
              className={`block w-full px-4 py-2 text-left ${
                selectedApp?.packageName === app.packageName
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="truncate" title={`${app.appName} (${app.packageName})`}>
                {app.appName}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 