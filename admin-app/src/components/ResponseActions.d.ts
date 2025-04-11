import React from 'react';
import { ResponseFile } from '../types/response';
interface ResponseActionsProps {
  deviceId: string | null;
  selectedApp: {
    packageName: string;
    appName: string;
  } | null;
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
export declare const ResponseActions: React.FC<ResponseActionsProps>;
export {};
