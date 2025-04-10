import React, { useState } from 'react';

interface FilenameDialogProps {
  isOpen: boolean;
  defaultFilename: string;
  onClose: () => void;
  onConfirm: (filename: string) => void;
}

export const FilenameDialog: React.FC<FilenameDialogProps> = ({
  isOpen,
  defaultFilename,
  onClose,
  onConfirm,
}) => {
  const [filename, setFilename] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFilename = filename.trim() || defaultFilename;
    onConfirm(finalFilename);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-semibold text-white mb-4">
          Choose Filename
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="filename"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Filename (without extension)
            </label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={defaultFilename}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-400">
              Default: {defaultFilename}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
