# Admin Responses

An Electron application built with React and Vite for managing admin responses.

## Features

- Modern React-based UI
- Electron desktop application
- Hot-reloading during development
- TypeScript support

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