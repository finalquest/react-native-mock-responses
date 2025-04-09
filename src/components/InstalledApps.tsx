import React, { useEffect, useState } from 'react';

interface InstalledApp {
  packageName: string;
  appName: string;
}

export const InstalledApps: React.FC = () => {
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<InstalledApp | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        console.log('Fetching installed apps...');
        const devices = await window.api.getConnectedDevices();
        console.log('Connected devices:', devices);

        if (devices.length === 0) {
          setError('No devices connected');
          setLoading(false);
          return;
        }

        const deviceId = devices[0]; // Use the first connected device
        console.log('Using device:', deviceId);
        
        const installedApps = await window.api.getInstalledApps(deviceId);
        console.log('Installed apps:', installedApps);
        
        setApps(installedApps);
        if (installedApps.length > 0) {
          setSelectedApp(installedApps[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching installed apps:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch installed apps');
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading apps...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
      >
        <span className="text-gray-400">Selected App:</span>
        <div className="flex items-center gap-2">
          <span>{selectedApp?.appName || 'Select an app'}</span>
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
                  onClick={() => {
                    setSelectedApp(app);
                    setIsOpen(false);
                  }}
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
  );
}; 