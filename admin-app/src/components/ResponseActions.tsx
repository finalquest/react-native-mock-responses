import React, { useState } from 'react';
import { FilenameDialog } from './FilenameDialog';
import { ResponseFile } from '../types/response';

interface ResponseActionsProps {
  deviceId: string | null;
  selectedApp: { packageName: string; appName: string } | null;
  selectedResponse: ResponseFile | null;
  onPullResponses: (
    deviceId: string,
    packageName: string,
    filename: string
  ) => void;
  onPushResponses: (
    deviceId: string,
    packageName: string,
    selectedFile: string
  ) => void;
  onCleanFiles: (deviceId: string, packageName: string) => void;
}

export const ResponseActions: React.FC<ResponseActionsProps> = ({
  deviceId,
  selectedApp,
  selectedResponse,
  onPullResponses,
  onPushResponses,
  onCleanFiles,
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePull = async (filename: string) => {
    if (!deviceId || !selectedApp) return;

    try {
      setIsPulling(true);
      await onPullResponses(deviceId, selectedApp.packageName, filename);
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

  const getDefaultFilename = () => {
    if (!selectedApp) return 'responses';
    return `${selectedApp.packageName}-responses`;
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsDialogOpen(true)}
          disabled={!deviceId || !selectedApp || isPulling}
          className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPulling ? 'Pulling...' : 'Pull'}
        </button>

        <button
          onClick={handlePush}
          disabled={!deviceId || !selectedResponse || isPushing}
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
