import React, { useState } from 'react'
import { ResponseFile } from '../types/response'
import { EndpointsPanel } from './EndpointsPanel'
import { MainPanel } from './MainPanel'

interface ResponseEditorProps {
  response: ResponseFile
  onSave: (response: ResponseFile) => void
  onCancel: () => void
  isDarkMode: boolean
}

export const ResponseEditor: React.FC<ResponseEditorProps> = ({
  response,
  onSave,
  onCancel,
  isDarkMode
}) => {
  const [editedResponse, setEditedResponse] = useState<ResponseFile>(response)
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    try {
      // Validate JSON
      JSON.parse(JSON.stringify(editedResponse.data))
      onSave(editedResponse)
    } catch (err) {
      setError('Invalid JSON format')
    }
  }

  return (
    <div className={`p-4 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="mb-4">
        <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Filename
        </label>
        <input
          type="text"
          value={editedResponse.filename}
          onChange={(e) => setEditedResponse({ ...editedResponse, filename: e.target.value })}
          className={`w-full p-2 rounded border ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
          }`}
        />
      </div>
      <div className="mb-4">
        <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Response Data
        </label>
        <textarea
          value={JSON.stringify(editedResponse.data, null, 2)}
          onChange={(e) => {
            try {
              const data = JSON.parse(e.target.value)
              setEditedResponse({ ...editedResponse, data })
              setError(null)
            } catch (err) {
              setError('Invalid JSON format')
            }
          }}
          className={`w-full h-64 p-2 rounded border font-mono ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
          }`}
        />
        {error && (
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className={`px-4 py-2 rounded ${
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  )
} 