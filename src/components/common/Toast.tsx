import React, { useEffect } from 'react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-pastel-green border-l-4 border-green-500';
      case 'error':
        return 'bg-pastel-red border-l-4 border-red-500';
      case 'warning':
        return 'bg-pastel-orange border-l-4 border-orange-500';
      case 'info':
        return 'bg-pastel-blue border-l-4 border-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
    }
  };

  return (
    <div className={`${getTypeStyles()} rounded-lg shadow-lg p-4 mb-4 flex items-center animate-slide-in-right`}>
      <span className="text-xl mr-3">{getIcon()}</span>
      <p className="text-gray-800 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-gray-600 hover:text-gray-800 transition-colors"
      >
        ✕
      </button>
    </div>
  );
};