import React from 'react';

interface DrawerToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
}

export const DrawerToggle: React.FC<DrawerToggleProps> = ({
  isOpen,
  onToggle,
  isDarkMode,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`
        fixed top-4 left-0 z-20 p-2 rounded-r transition-all duration-300 ease-in-out
        ${
          isDarkMode
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
            : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
        }
        ${isOpen ? 'left-64' : 'left-0'}
      `}
    >
      {isOpen ? (
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
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
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
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      )}
    </button>
  );
};
