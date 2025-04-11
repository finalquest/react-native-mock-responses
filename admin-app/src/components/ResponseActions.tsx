import React, { useState, useEffect, useRef } from 'react';
import { FilenameDialog } from './FilenameDialog';
import { ResponseFile } from '../types/response';

interface ResponseActionsProps {
  deviceId: string | null;
  selectedApp: { packageName: string; appName: string } | null;
  selectedResponse: ResponseFile | null;
  onPullResponses: (
    deviceId: string,
    packageName: string,
    filename: string,
    linkStorage: boolean
  ) => void;
  onPushResponses: (
    deviceId: string,
    packageName: string,
    selectedFile: string
  ) => void;
  onCleanFiles: (deviceId: string, packageName: string) => void;
  onRefreshFiles: () => void;
}

export const ResponseActions: React.FC<ResponseActionsProps> = ({
  deviceId,
  selectedApp,
  selectedResponse,
  onPullResponses,
  onPushResponses,
  onCleanFiles,
  onRefreshFiles,
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savePath, setSavePath] = useState('');
  const [linkStorage, setLinkStorage] = useState(false);
  const prevSavePathRef = useRef('');

  // Load save path on mount
  useEffect(() => {
    const loadSavePath = async () => {
      try {
        const path = await window.api.getSavePath();
        if (path) {
          setSavePath(path);
          prevSavePathRef.current = path;
        }
      } catch (error) {
        console.error('Error loading save path:', error);
      }
    };
    loadSavePath();
  }, []);

  useEffect(() => {
    if (savePath && savePath !== prevSavePathRef.current) {
      window.api.setSavePath(savePath);
      onRefreshFiles();
      prevSavePathRef.current = savePath;
    }
  }, [savePath, onRefreshFiles]);

  const handlePull = async (filename: string) => {
    if (!deviceId || !selectedApp) return;

    try {
      setIsPulling(true);
      await onPullResponses(
        deviceId,
        selectedApp.packageName,
        filename,
        linkStorage
      );
    } finally {
      setIsPulling(false);
    }
  };

  const handlePush = async () => {
    if (!deviceId || !selectedApp || !selectedResponse) return;
    setIsPushing(true);
    try {
      await onPushResponses(
        deviceId,
        selectedApp.packageName,
        selectedResponse.filename
      );
    } finally {
      setIsPushing(false);
    }
  };

  const handleClean = async () => {
    if (!deviceId || !selectedApp) return;
    setIsCleaning(true);
    try {
      await onCleanFiles(deviceId, selectedApp.packageName);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleSelectFolder = async () => {
    try {
      const selectedPath = await window.api.selectFolder();
      if (selectedPath) {
        setSavePath(selectedPath);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  const getDefaultFilename = () => {
    if (!selectedApp) return 'responses';
    return `${selectedApp.packageName}-responses`;
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="text"
            value={savePath}
            onChange={(e) => setSavePath(e.target.value)}
            placeholder="Select save location..."
            className="w-64 pl-3 pr-10 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSelectFolder}
            className="absolute right-0 top-0 h-full px-2 text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={linkStorage}
              onChange={(e) => setLinkStorage(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            Link Storage
          </label>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          disabled={!deviceId || !selectedApp || isPulling}
          className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPulling ? 'Pulling...' : 'Pull'}
        </button>

        <button
          onClick={handlePush}
          disabled={!deviceId || !selectedApp || !selectedResponse || isPushing}
          className="px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPushing ? 'Pushing...' : 'Push'}
        </button>

        <button
          onClick={handleClean}
          disabled={!deviceId || !selectedApp || isCleaning}
          className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCleaning ? 'Cleaning...' : 'Clean'}
        </button>
      </div>

      <FilenameDialog
        isOpen={isDialogOpen}
        defaultFilename={getDefaultFilename()}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handlePull}
      />
    </>
  );
};
