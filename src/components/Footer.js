import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import homeIcon from '../assets/home.png';
import starIcon from '../assets/star.png';
import trophyIcon from '../assets/trophy.png';
import settingsIcon from '../assets/settings.png';

const Footer = () => {
    return (
        <footer className="footer">
            <Link to="/mainpage" className="footer-item">
                <img src={homeIcon} alt="Home" />
            </Link>
            <Link to="/favorites" className="footer-item">
                <img src={starIcon} alt="Favorites" />
            </Link>
            <Link to="/bracketpage" className="footer-item">
                <img src={trophyIcon} alt="Trophies" />
            </Link>
            <Link to="/settings" className="footer-item">
                <img src={settingsIcon} alt="Settings" />
            </Link>
        </footer>
    );
};

export default Footer;
