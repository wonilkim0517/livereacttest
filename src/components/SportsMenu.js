import React from 'react';
import './SportsMenu.css';

const sports = ["LIVE", "축구", "농구", "피구", "배드민턴"]; 

const SportsMenu = ({ selectedSport, onSelectSport }) => {
  return (
    <div className="sports-menu">
      {sports.map((sport, index) => (
        <div 
          key={index} 
          className={`sports-menu-item ${selectedSport === sport ? 'active' : ''}`} 
          onClick={() => onSelectSport(sport)}
        >
          {sport}
        </div>
      ))}
    </div>
  );
};

export default SportsMenu;
