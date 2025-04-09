import React from 'react'

interface DrawerToggleProps {
  isOpen: boolean
  onToggle: () => void
}

export const DrawerToggle: React.FC<DrawerToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        fixed top-4 left-0 z-20 p-2 bg-gray-800 hover:bg-gray-700
        rounded-r transition-all duration-300 ease-in-out
        ${isOpen ? 'left-64' : 'left-0'}
      `}
    >
      {isOpen ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      )}
    </button>
  )
} 