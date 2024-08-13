import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import Header from '../components/Header';
import SportsMenu from '../components/SportsMenu';
import Footer from '../components/Footer';
import './MainPage.css';
import userImage from '../assets/user-image.png';
import starIcon from '../assets/star.png';
import calendarIcon from '../assets/calendar.png';
import menuIcon from '../assets/menu.png'; // 세줄 아이콘 이미지 파일

const AdminMainPage = () => {
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [date, setDate] = useState(new Date());
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSport, setSelectedSport] = useState('LIVE');
  const navigate = useNavigate();

  useEffect(() => {
    // 학과 데이터를 불러옵니다.
    fetch('/departments.json')
      .then(response => response.json())
      .then(data => setDepartments(data))
      .catch(error => console.error('Error loading departments:', error));
  }, []);

  useEffect(() => {
    // 매치 데이터를 필터링된 조건으로 가져옵니다.
    const fetchMatches = async () => {
      try {
        const response = await axiosInstance.get(`/api/matches`, {
          params: {
            sport: selectedSport,
            date: formatDate(date),
            department: selectedDepartment
          }
        });
        setMatches(response.data);
      } catch (error) {
        console.error('Error loading matches:', error);
      }
    };
    fetchMatches();
  }, [selectedSport, date, selectedDepartment]);

  const addToFavorites = (match) => {
    setFavorites(prevFavorites => {
      const isDuplicate = prevFavorites.some(fav => fav.matchId === match.matchId);
      if (!isDuplicate) {
        const updatedFavorites = [...prevFavorites, { matchId: match.matchId }];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        return updatedFavorites;
      }
      return prevFavorites;
    });

    // 즐겨찾기에 추가한 후 FavoritesPage로 이동
    navigate('/favorites');
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }
  }, []);

  const isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const handleMatchClick = async (matchId) => {
    try {
      const response = await axiosInstance.get(`/api/matches/${matchId}`);
      
      console.log(response.data);
      navigate(`/matchDetail/${matchId}`);
    } catch (error) {
      console.error('Error fetching match details:', error);
    }
  };

  const filteredMatches = matches.filter(match =>
    (selectedSport === 'LIVE' || match.sport === selectedSport) &&
    (selectedDepartment === '' || match.teamName1 === selectedDepartment || match.teamName2 === selectedDepartment) &&
    isSameDate(match.date, date)
  );

  const groupedMatches = filteredMatches.reduce((acc, match) => {
    if (!acc[match.sport]) {
      acc[match.sport] = [];
    }
    acc[match.sport].push(match);
    return acc;
  }, {});

  const formatDate = (date) => {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${month}/${day}`;
  };

  const getStatusLabel = (status) => {
    return status === 'FUTURE' ? '예정' : status;
  };

  return (
    <div className="main-page">
      <Header />
      <img src={menuIcon} alt="menu icon" onClick={() => navigate('/mypage')} className="menu-icon" /> {/* 세줄 아이콘 */}
      <SportsMenu selectedSport={selectedSport} onSelectSport={setSelectedSport} />
      <div className="create-buttons">
        <button className="create-button" onClick={() => navigate('/create-match')}>경기 생성</button>
        <button className="create-button" onClick={() => navigate('/create-team')}>팀 생성</button>
      </div>
      <div className="content">
        <div className="header-section">
          <div className="date-picker">
            <div className="date">{formatDate(date)}</div>
            <Flatpickr 
              value={date} 
              onChange={date => setDate(date)} 
              options={{ dateFormat: "Y-m-d", wrap: true }}
            >
              <div className="calendar-container">
                <input type="text" data-input style={{ display: 'none' }} /> 
                <button className="calendar-button" type="button" data-toggle>
                  <img src={calendarIcon} alt="Calendar" className="calendar-icon" />
                </button>
              </div>
            </Flatpickr>
          </div>
          <div className="department-dropdown">
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="department-select"
            >
              <option value="">학과 선택</option>
              {departments.map(department => (
                <option key={department.id} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {Object.keys(groupedMatches).map((sport, index) => (
          <div key={index} className="match-section">
            <div className="match-title">{sport}</div>
            {groupedMatches[sport].map((match, idx) => (
              <div 
                key={idx} 
                className="match-item" 
                onClick={() => handleMatchClick(match.matchId)}
              >
                <img src={userImage} alt="user" className="user-image" />
                <div className="team-name">{match.teamName1}</div>
                <div className="score">{match.teamScore1}</div>
                <button 
                  className={match.status === 'LIVE' ? 'live-button' : 'end-button'}
                >
                  {getStatusLabel(match.status)}
                </button>
                <div className="score">{match.teamScore2}</div>
                <div className="team-name">{match.teamName2}</div>
                <img src={userImage} alt="user" className="user-image" />
                <img src={starIcon} alt="star" className="star-icon" onClick={(e) => { e.stopPropagation(); addToFavorites(match); }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default AdminMainPage;
