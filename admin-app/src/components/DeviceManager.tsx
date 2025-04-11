import React, { useEffect, useState } from 'react';

export const DeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [installedApps, setInstalledApps] = useState<
    { packageName: string; appName: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const connectedDevices = await window.api.getConnectedDevices();
        setDevices(connectedDevices);
        setError(null);
      } catch (err) {
        setError('Failed to fetch connected devices');
        console.error('Error fetching devices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    const fetchInstalledApps = async () => {
      if (!selectedDevice) return;

      try {
        setLoading(true);
        const apps = await window.api.getInstalledApps(selectedDevice);
        setInstalledApps(apps);
        setError(null);
      } catch (err) {
        setError('Failed to fetch installed apps');
        console.error('Error fetching installed apps:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstalledApps();
  }, [selectedDevice]);

  const handleDeviceSelect = (device: string) => {
    setSelectedDevice(device);
  };

  return (
    <div className="device-manager">
      <h2>Device Manager</h2>

      {error && <div className="error">{error}</div>}

      <div className="devices">
        <h3>Connected Devices</h3>
        {loading ? (
          <div>Loading...</div>
        ) : devices.length === 0 ? (
          <div>No devices connected</div>
        ) : (
          <ul>
            {devices.map((device) => (
              <li
                key={device}
                className={selectedDevice === device ? 'selected' : ''}
                onClick={() => handleDeviceSelect(device)}
              >
                {device}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDevice && (
        <div className="installed-apps">
          <h3>Installed Apps</h3>
          {loading ? (
            <div>Loading...</div>
          ) : installedApps.length === 0 ? (
            <div>No apps found</div>
          ) : (
            <ul>
              {installedApps.map((app) => (
                <li key={app.packageName}>
                  {app.appName} ({app.packageName})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
