import React, { useState, useEffect } from 'react';
import ProductAnalyzer from './components/ProductAnalyzer';
import Header from './components/common/Header';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('darkMode')) {
      return localStorage.getItem('darkMode') === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      <div className="flex flex-col h-screen">
          <Header 
              title="ZAD - تحليل المنتج"
              isDarkMode={isDarkMode} 
              toggleDarkMode={toggleDarkMode}
          />
          <main className="flex-grow overflow-y-auto">
              <ProductAnalyzer />
          </main>
      </div>
    </div>
  );
};

export default App;
