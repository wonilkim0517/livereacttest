import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(1);

  const toggleTheme = (value) => {
    setTheme(value);
    localStorage.setItem('theme', value);
  };

  const changeFontSize = (value) => {
    setFontSize(value);
    localStorage.setItem('fontSize', value);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedFontSize = localStorage.getItem('fontSize');
    if (storedTheme) setTheme(storedTheme);
    if (storedFontSize) setFontSize(storedFontSize);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, fontSize, toggleTheme, changeFontSize }}>
      <div style={{ fontSize: `${fontSize}em`, height: '100%' }} className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);