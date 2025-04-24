import { useState, useEffect } from 'react';
import { FileDrawer } from './components/FileDrawer';
import { DrawerToggle } from './components/DrawerToggle';
import { DeviceSelector } from './components/DeviceSelector';
import { InstalledApps } from './components/InstalledApps';
import { ResponseActions } from './components/ResponseActions';
import { EndpointsPanel } from './components/EndpointsPanel';
import { MainPanel } from './components/MainPanel';
import { ResponseFile } from './types/response';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [responses, setResponses] = useState<ResponseFile[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<ResponseFile | null>(
    null
  );
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<{
    packageName: string;
    appName: string;
  } | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'responses' | 'storage'>(
    'responses'
  );

  const fetchResponses = async () => {
    try {
      const result = await window.api.getResponseFiles();

      // Process storage files
      const processedResponses = result
        .map((response) => {
          const storageFilename = response.filename.replace(
            '.json',
            '-storage.json'
          );
          const storageFile = result.find(
            (r) => r.filename === storageFilename
          );

          return {
            ...response,
            hasStorage: !!storageFile,
            storage: storageFile?.data || undefined,
          };
        })
        .filter((response) => !response.filename.endsWith('-storage.json')); // Filter out storage files from the list

      setResponses(processedResponses);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        await window.api.getConnectedDevices();
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleResponseClick = (filename: string) => {
    const response = responses.find((r) => r.filename === filename);
    if (response) {
      setSelectedResponse(response);
      setSelectedEndpoint(null);
      setIsDrawerOpen(false);
    }
  };

  const handleUpdateEndpoint = async (updatedEndpoint: any) => {
    if (!selectedResponse || !selectedEndpoint) return;

    const updatedResponse = {
      ...selectedResponse,
      data: {
        ...selectedResponse.data,
        [selectedEndpoint]: updatedEndpoint,
      },
    };

    try {
      await window.api.saveResponseFile({
        filename: selectedResponse.filename,
        content: updatedResponse.data,
      });
      setSelectedResponse(updatedResponse);
      setResponses((prevResponses) =>
        prevResponses.map((response) =>
          response.filename === selectedResponse.filename
            ? updatedResponse
            : response
        )
      );
    } catch (error) {
      console.error('Error updating endpoint:', error);
    }
  };

  const handleUpdateStorage = async (updatedStorage: any) => {
    if (!selectedResponse) return;

    const updatedResponse = {
      ...selectedResponse,
      storage: updatedStorage,
    };

    try {
      await window.api.saveResponseFile({
        filename: selectedResponse.filename,
        content: updatedResponse.data,
      });
      setSelectedResponse(updatedResponse);
      setResponses((prevResponses) =>
        prevResponses.map((response) =>
          response.filename === selectedResponse.filename
            ? updatedResponse
            : response
        )
      );
    } catch (error) {
      console.error('Error updating storage:', error);
    }
  };

  const handlePullResponses = async (
    deviceId: string,
    packageName: string,
    filename: string,
    linkStorage: boolean
  ) => {
    try {
      await window.api.pullResponses(
        deviceId,
        packageName,
        filename,
        linkStorage
      );

      // Fetch all response files after pulling
      await fetchResponses();
      setSelectedResponse(null);
      setSelectedEndpoint(null);
    } catch (error) {
      console.error('Error pulling responses:', error);
    }
  };

  const handlePushResponses = async (
    deviceId: string,
    packageName: string,
    selectedFile: string
  ) => {
    try {
      await window.api.pushResponses(deviceId, packageName, selectedFile);
      await window.api.restartApp(deviceId, packageName);
    } catch (error) {
      console.error('Error pushing responses:', error);
    }
  };

  const handleCleanFiles = async (deviceId: string, packageName: string) => {
    try {
      await window.api.cleanFiles(deviceId, packageName);
    } catch (error) {
      console.error('Error cleaning files:', error);
    }
  };

  const handleAppSelect = (app: { packageName: string; appName: string }) => {
    setSelectedApp(app);
  };

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
  };

  return (
    <div
      className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}
    >
      <FileDrawer
        isOpen={isDrawerOpen}
        responses={responses}
        selectedResponse={selectedResponse}
        onResponseClick={handleResponseClick}
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={fetchResponses}
      />
      <div className="flex-1 flex flex-col h-screen">
        <div
          className={`flex flex-col p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 pl-8">
              <DrawerToggle
                isOpen={isDrawerOpen}
                onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
                isDarkMode={isDarkMode}
              />
              <DeviceSelector
                onDeviceSelect={handleDeviceSelect}
                isDarkMode={isDarkMode}
              />
              <InstalledApps
                deviceId={selectedDevice}
                onAppSelect={handleAppSelect}
                isDarkMode={isDarkMode}
              />
              <ResponseActions
                deviceId={selectedDevice}
                selectedApp={selectedApp}
                selectedResponse={selectedResponse}
                onPullResponses={handlePullResponses}
                onPushResponses={handlePushResponses}
                onCleanFiles={handleCleanFiles}
                onRefreshFiles={fetchResponses}
              />
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              {isDarkMode ? (
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)]">
          <EndpointsPanel
            selectedResponse={selectedResponse}
            selectedEndpoint={selectedEndpoint}
            onEndpointClick={setSelectedEndpoint}
            isDarkMode={isDarkMode}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <MainPanel
            selectedResponse={selectedResponse}
            selectedEndpoint={selectedEndpoint}
            onUpdateEndpoint={handleUpdateEndpoint}
            isDarkMode={isDarkMode}
            activeTab={activeTab}
            onUpdateStorage={handleUpdateStorage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
