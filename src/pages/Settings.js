import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Settings.css';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const { theme, fontSize, toggleTheme, changeFontSize } = useTheme();

  return (
    <div className={`settings-page ${theme}`}>
      <Header />
      <div className="content">
        <div className="settings-section">
          <label>글자 크기</label>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={fontSize}
            onChange={(e) => changeFontSize(e.target.value)}
          />
          <div className="font-size-labels">
            <span style={{ fontSize: '1em' }}>A</span>
            <span style={{ fontSize: `${fontSize}em` }}>A</span>
          </div>
        </div>
        <div className="settings-section">
          <label>화면 스타일</label>
          <div className="theme-options">
            <label className="theme-option">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={(e) => toggleTheme(e.target.value)}
              />
              라이트 모드
            </label>
            <label className="theme-option">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={(e) => toggleTheme(e.target.value)}
              />
              다크 모드
            </label>
          </div>
        </div>
        <div className="settings-section">
          <label>고객센터</label>
          <button className="contact-button">자주 묻는 질문</button>
          <button className="contact-button">Contact Us</button>
        </div>
        <div className="settings-section">
          <label>이용약관</label>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
