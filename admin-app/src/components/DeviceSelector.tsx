import React, { useState, useEffect, useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

interface DeviceSelectorProps {
  onDeviceSelect: (deviceId: string) => void;
  isDarkMode: boolean;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  onDeviceSelect,
  isDarkMode,
}) => {
  const [devices, setDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const result = await window.api.getConnectedDevices();
        setDevices(result);
        if (result.length > 0) {
          setSelectedDevice(result[0]);
          onDeviceSelect(result[0]);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, [onDeviceSelect]);

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setIsOpen(false);
    onDeviceSelect(deviceId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 ${
          isDarkMode
            ? 'bg-gray-700 text-gray-100 border-gray-600'
            : 'bg-white text-gray-800 border-gray-200'
        }`}
      >
        <span>{selectedDevice || 'Select Device'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-1 w-64 rounded shadow-lg z-10 ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600'
              : 'bg-white border-gray-200'
          }`}
        >
          {devices.map((device) => (
            <button
              key={device}
              onClick={() => handleDeviceSelect(device)}
              className={`block w-full px-4 py-2 text-left ${
                selectedDevice === device
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-100 hover:bg-gray-600'
                    : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <div className="truncate" title={device}>
                {device}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
