import React, { useState, useEffect, useRef } from 'react'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (body: any) => void
  initialBody: any
  isDarkMode: boolean
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
  isDarkMode
}) => {
  const [body, setBody] = useState(JSON.stringify(initialBody, null, 2))
  const [error, setError] = useState<JSONError | null>(null)
  const [isValid, setIsValid] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setBody(JSON.stringify(initialBody, null, 2))
      setError(null)
      setIsValid(true)
    }
  }, [isOpen, initialBody])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.selectionStart = cursorPosition
      textareaRef.current.selectionEnd = cursorPosition
    }
  }, [cursorPosition])

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
    setCursorPosition(e.target.selectionStart)
    
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
      <div className={`rounded-lg p-6 w-3/4 h-3/4 flex flex-col ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit JSON</h2>
          <button
            onClick={onClose}
            className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className={`mb-4 p-3 rounded ${isDarkMode ? 'bg-red-500 bg-opacity-20 border border-red-500 text-red-500' : 'bg-red-100 border border-red-200 text-red-700'}`}>
            <div className="font-bold">JSON Error:</div>
            <div>{error.message}</div>
            <div className="text-sm mt-1">
              Line: {error.line}, Column: {error.column}
            </div>
          </div>
        )}

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={body}
            onChange={handleBodyChange}
            onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart)}
            className={`w-full h-full p-2 font-mono text-sm rounded ${
              isDarkMode 
                ? 'bg-gray-900 border-gray-700 text-gray-100' 
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
            style={{ 
              resize: 'none',
              outline: 'none',
              lineHeight: '1.5',
              tabSize: 2
            }}
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

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`px-4 py-2 rounded ${
              isValid 
                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                : isDarkMode
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
} 