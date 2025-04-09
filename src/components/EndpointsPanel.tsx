import React, { useState, useRef, useEffect } from 'react'
import { ResponseFile } from '../types/response'

interface EndpointsPanelProps {
  selectedResponse: ResponseFile | null
  selectedEndpoint: string | null
  onEndpointClick: (endpoint: string) => void
}

export const EndpointsPanel: React.FC<EndpointsPanelProps> = ({
  selectedResponse,
  selectedEndpoint,
  onEndpointClick,
}) => {
  const [width, setWidth] = useState(300)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const stopResizing = () => {
    setIsResizing(false)
  }

  const resize = (e: MouseEvent) => {
    if (isResizing && panelRef.current) {
      const newWidth = e.clientX - panelRef.current.getBoundingClientRect().left
      if (newWidth >= 200 && newWidth <= 500) {
        setWidth(newWidth)
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
    <div
      ref={panelRef}
      className="flex flex-col border-r border-gray-700 relative"
      style={{ width: `${width}px` }}
    >
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Endpoints</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {selectedResponse && (
          <div className="p-4 space-y-2">
            {Object.entries(selectedResponse.data).map(([endpoint, data]) => (
              <div
                key={endpoint}
                className={`p-2 rounded cursor-pointer ${
                  selectedEndpoint === endpoint
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => onEndpointClick(endpoint)}
              >
                {endpoint}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
        onMouseDown={startResizing}
      />
    </div>
  )
} 