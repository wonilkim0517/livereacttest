import React from 'react';
import './Header.css';
import menuIcon from '../assets/menu.png'; 

const Header = () => {
    return (
        <header className="header">
            <button className="menu-button" aria-label="Open menu">
                <img src={menuIcon} alt="Menu" />
            </button>
            <h1 className="title">경기 일정</h1>
        </header>
    );
};

export default Header;
