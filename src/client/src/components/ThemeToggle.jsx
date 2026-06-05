import React from 'react';
import '../styles/themetoggle.css';

function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} title="Toggle dark mode">
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
