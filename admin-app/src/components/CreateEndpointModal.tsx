import React, { useState, useEffect } from 'react';
import { JSONError, validateJSON } from '../utils/jsonValidation';

interface CreateEndpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (endpoint: {
    path: string;
    method: string;
    status: number;
    headers: Record<string, string>;
    body: any;
  }) => void;
  isDarkMode: boolean;
}

export const CreateEndpointModal: React.FC<CreateEndpointModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isDarkMode,
}) => {
  const [path, setPath] = useState('');
  const [method, setMethod] = useState('GET');
  const [status, setStatus] = useState(200);
  const [body, setBody] = useState('{}');
  const [error, setError] = useState<JSONError | null>(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setPath('');
      setMethod('GET');
      setStatus(200);
      setBody('{}');
      setError(null);
      setIsValid(true);
    }
  }, [isOpen]);

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value;
    setBody(newBody);

    if (newBody.trim() === '') {
      setError({
        message: 'JSON cannot be empty',
        line: 1,
        column: 1,
        position: 0,
      });
      setIsValid(false);
      return;
    }

    const jsonError = validateJSON(newBody);
    if (jsonError) {
      setError(jsonError);
      setIsValid(false);
    } else {
      setError(null);
      setIsValid(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      // Insert two spaces at the cursor position
      const newValue = value.substring(0, start) + '  ' + value.substring(end);

      setBody(newValue);

      // Move cursor after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError({
        message: 'Please fix JSON errors before creating',
        line: 1,
        column: 1,
        position: 0,
      });
      return;
    }

    try {
      const parsedBody = JSON.parse(body);
      onCreate({
        path,
        method,
        status,
        headers: defaultHeaders,
        body: parsedBody,
      });
      onClose();
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };

  if (!isOpen) return null;

  const defaultHeaders = {
    'content-type': 'application/json',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg shadow-xl w-96 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Create New Endpoint
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Path
              </label>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/api/example"
                className={`w-full px-3 py-2 rounded ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`w-full px-3 py-2 rounded ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Status Code
              </label>
              <input
                type="number"
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                min={100}
                max={599}
                className={`w-full px-3 py-2 rounded ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Response Body (JSON)
              </label>
              <textarea
                value={body}
                onChange={handleBodyChange}
                onKeyDown={handleKeyDown}
                className={`w-full px-3 py-2 rounded font-mono text-sm ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? 'border-red-500' : ''
                }`}
                rows={5}
                required
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error.message} (Line: {error.line}, Column: {error.column})
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-4 py-2 rounded ${
                isValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
