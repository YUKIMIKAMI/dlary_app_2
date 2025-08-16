import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
            📔 日記アプリ
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-pastel-blue border-b-2 border-pastel-blue pb-1' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              新規日記
            </Link>
            <Link
              to="/history"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/history' 
                  ? 'text-pastel-blue border-b-2 border-pastel-blue pb-1' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              過去の日記
            </Link>
            <Link
              to="/settings"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/settings' 
                  ? 'text-pastel-blue border-b-2 border-pastel-blue pb-1' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              設定
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};