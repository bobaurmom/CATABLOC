import React, { useState, useEffect } from 'react';

export type AlertState = 'default' | 'success' | 'fail';

export interface BreadcrumbAlertProps {
  state?: AlertState;
  children: React.ReactNode;
  duration?: number; // Time in milliseconds before auto-closing. Use 0 to disable auto-close.
  onClose?: () => void;
}

export const BreadcrumbAlert: React.FC<BreadcrumbAlertProps> = ({
  state = 'default',
  children,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const stateStyles = {
    default: 'bg-gray-100 text-gray-800 border-gray-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    fail: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div 
      className={`flex items-center fixed bottom-1/5 left-1/2 justify-between p-3 mb-4 rounded border shadow-sm ${stateStyles[state]} transition-opacity duration-300 ease-in-out`}
      role="alert"
    >
      <div className="flex-1 text-sm font-medium">
        {children}
      </div>
      <button
        onClick={handleClose}
        className="ml-4 text-current opacity-70 hover:opacity-100 focus:outline-none transition-opacity hover:cursor-pointer"
        aria-label="Close"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
    </div>
  );
};

export default BreadcrumbAlert;
