# Admin Responses

An Electron application built with React and Vite for managing admin responses.

## Features

- Modern React-based UI with dark/light mode support
- Responsive and intuitive interface
- Device and app management
- Response file management
- Electron desktop application
- Hot-reloading during development
- TypeScript support

## UI Features

- **Dark/Light Mode**: Toggle between dark and light themes for better visibility
- **Device Management**: Select and manage connected devices
- **App Selection**: Choose from installed apps on the selected device
- **Response Files**: View and manage response files in a collapsible drawer
- **Responsive Layout**: Adapts to different screen sizes
- **Modern Design**: Clean and intuitive interface with consistent styling

## Usage

### Device and App Management

1. **Select a Device**:
   - Use the device dropdown to select a connected Android device
   - The app will automatically detect and list available devices

2. **Select an App**:
   - After selecting a device, choose an app from the installed apps dropdown
   - The list will show all third-party apps installed on the device

### Response File Management

1. **View Response Files**:
   - Click the drawer toggle button (☰) to open the file drawer
   - Browse through available response files
   - Each file shows the number of endpoints it contains

2. **Pull Responses**:
   - Select a device and app
   - Click the "Pull" button to fetch responses from the device
   - Choose a filename or use the default one
   - Responses will be downloaded and displayed in the drawer

3. **Push Responses**:
   - After making changes to responses
   - Click the "Push" button to update the responses on the device
   - The app will automatically restart to apply changes

### Theme Customization

- Toggle between dark and light mode using the theme switch
- The interface will adapt to your preferred theme
- All components maintain consistent styling in both modes

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd admin-responses
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
npm run electron:dev
```

This will:
- Start the Vite development server
- Launch the Electron application
- Enable hot-reloading for React components

## Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run electron:dev` - Start the Electron app in development mode
- `npm run electron:build` - Build the Electron app for production

## Project Structure

```
admin-responses/
├── electron/          # Electron main process
├── src/              # React application source
│   ├── components/   # React components
│   │   ├── DeviceSelector.tsx
│   │   ├── FileDrawer.tsx
│   │   ├── InstalledApps.tsx
│   │   └── ...
│   ├── App.tsx       # Main React component
│   └── main.tsx      # React entry point
├── index.html        # HTML template
├── vite.config.ts    # Vite configuration
└── package.json      # Project dependencies and scripts
```

## Building for Production

To create a production build:

```bash
npm run electron:build
```

This will create a distributable package in the `dist` directory.

## License

ISC 