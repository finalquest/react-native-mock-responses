import React, { useState, useEffect } from 'react'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (body: any) => void
  initialBody: any
}

interface JSONError {
  message: string
  line: number
  column: number
  position: number
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBody,
}) => {
  const [body, setBody] = useState(() => JSON.stringify(initialBody, null, 2))
  const [error, setError] = useState<JSONError | null>(null)
  const [isValid, setIsValid] = useState(true)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setBody(JSON.stringify(initialBody, null, 2))
      setError(null)
      setIsValid(true)
    }
  }, [isOpen, initialBody])

  const findErrorPosition = (jsonString: string, position: number): { line: number; column: number } => {
    const lines = jsonString.split('\n')
    let line = 1
    let column = 1
    let currentPosition = 0

    for (const lineText of lines) {
      if (currentPosition + lineText.length >= position) {
        column = position - currentPosition + 1
        break
      }
      currentPosition += lineText.length + 1 // +1 for the newline character
      line++
    }

    return { line, column }
  }

  const validateJSON = (jsonString: string): JSONError | null => {
    try {
      JSON.parse(jsonString)
      return null
    } catch (err) {
      if (err instanceof SyntaxError) {
        const match = err.message.match(/position (\d+)/)
        if (match) {
          const position = parseInt(match[1], 10)
          const { line, column } = findErrorPosition(jsonString, position)
          return {
            message: err.message,
            line,
            column,
            position
          }
        }
      }
      return {
        message: 'Invalid JSON format',
        line: 1,
        column: 1,
        position: 0
      }
    }
  }

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value
    setBody(newBody)
    
    if (newBody.trim() === '') {
      setError({
        message: 'JSON cannot be empty',
        line: 1,
        column: 1,
        position: 0
      })
      setIsValid(false)
      return
    }

    const jsonError = validateJSON(newBody)
    if (jsonError) {
      setError(jsonError)
      setIsValid(false)
    } else {
      setError(null)
      setIsValid(true)
    }
  }

  const handleSave = () => {
    if (!isValid) {
      setError({
        message: 'Please fix JSON errors before saving',
        line: 1,
        column: 1,
        position: 0
      })
      return
    }

    try {
      const parsedBody = JSON.parse(body)
      onSave(parsedBody)
      onClose()
    } catch (err) {
      setError({
        message: 'Unexpected error while saving',
        line: 1,
        column: 1,
        position: 0
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-3xl mx-4">
        <div className="border-b border-gray-800 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Response Body</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-500">
              <div className="font-bold">JSON Error:</div>
              <div>{error.message}</div>
              <div className="text-sm mt-1">
                Line: {error.line}, Column: {error.column}
              </div>
            </div>
          )}
          
          <div className="relative">
            <textarea
              value={body}
              onChange={handleBodyChange}
              className={`w-full h-96 bg-black rounded p-4 font-mono text-sm focus:outline-none focus:ring-2 ${
                isValid ? 'focus:ring-blue-500' : 'focus:ring-red-500'
              }`}
              spellCheck={false}
            />
            {error && (
              <div 
                className="absolute pointer-events-none"
                style={{
                  top: `${(error.line - 1) * 1.5}rem`,
                  left: `${error.column * 0.6}rem`,
                }}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`px-4 py-2 rounded ${
              isValid 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
} 