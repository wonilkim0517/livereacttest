//favoritepages.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SportsMenu from '../components/SportsMenu';
import './MainPage.css';
import userImage from '../assets/user-image.png';

const FavoritesPage = () => {
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 로그인한 사용자의 userId를 가져오는 API 호출
        const userResponse = await axios.get('https://suportscore.site/api/auth/user');
        const userId = userResponse.data.userId;

        // 사용자의 즐겨찾기 목록 가져오기
        const favoritesResponse = await axios.get(`https://suportscore.site/api/users/${userId}/bookmark`);
        setFavorites(favoritesResponse.data);

        // 즐겨찾기 목록에 있는 모든 매치 데이터 가져오기
        const matchIds = favoritesResponse.data.map(favorite => favorite.matchId);
        const matchPromises = matchIds.map(matchId =>
          axios.get(`https://suportscore.site/api/matches/${matchId}`)
        );
        const matchesResponse = await Promise.all(matchPromises);
        const matchesData = matchesResponse.map(response => response.data);

        setMatches(matchesData);
        setLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  // Group favorite matches by sport
  const groupedFavorites = matches.reduce((acc, match) => {
    if (!acc[match.sport]) {
      acc[match.sport] = [];
    }
    acc[match.sport].push(match);
    return acc;
  }, {});

  console.log('Grouped favorites:', groupedFavorites);

  const getStatusLabel = (status) => {
    return status === 'FUTURE' ? '예정' : status;
  };

  return (
    <div className="main-page">
      <Header />
      <SportsMenu />
      <div className="content">
        <h2>Favorites</h2>
        {Object.keys(groupedFavorites).map((sport, index) => (
          <div key={index} className="match-section">
            <div className="match-title">{sport}</div>
            {groupedFavorites[sport].map((match, idx) => (
              <div key={idx} className="match-item">
                <img src={userImage} alt="user" className="user-image" />
                <div className="team-name">{match.teamName1}</div>
                <div className="score">{match.teamScore1}</div>
                <button className={match.status === 'LIVE' ? 'live-button' : 'end-button'}>
                  {getStatusLabel(match.status)}
                </button>
                <div className="score">{match.teamScore2}</div>
                <div className="team-name">{match.teamName2}</div>
                <img src={userImage} alt="user" className="user-image" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
