import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  title: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="w-10 h-10" />
      <h1 className="text-xl font-bold text-primary-dark dark:text-primary-light">{title}</h1>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="تبديل الوضع"
      >
        {isDarkMode ? (
          <Sun className="text-yellow-400" />
        ) : (
          <Moon className="text-gray-700" />
        )}
      </button>
    </header>
  );
};

export default Header;
