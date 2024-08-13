import React, { useState } from 'react';
//import { Bracket } from 'react-tournament-bracket';
// import { SingleEliminationBracket, SVGViewer } from '@g-loot/react-tournament-brackets';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './BracketPage.css';
import { leagueData, tournamentData } from './data';

const BracketPage = () => {
  const [selectedSport, setSelectedSport] = useState('soccer');
  const [activeTab, setActiveTab] = useState('tournament');

  const renderLeagueTable = () => (
    leagueData[selectedSport].map((group, groupIndex) => (
      <div key={groupIndex} className="group-section">
        <h2>{group.group}</h2>
        <table>
          <thead>
            <tr>
              <th>학과</th>
              <th>승</th>
              <th>무</th>
              <th>패</th>
              <th>승점</th>
            </tr>
          </thead>
          <tbody>
            {group.teams.map((team, index) => (
              <tr key={index}>
                <td>{team.department}</td>
                <td>{team.win}</td>
                <td>{team.draw}</td>
                <td>{team.lose}</td>
                <td>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))
  );

  const getBracketGames = () => {
    return tournamentData[selectedSport];
  };

  const renderTournamentBracket = () => {
    const matches = getBracketGames();
    if (!matches.length) {
      return <div>토너먼트 데이터가 없습니다.</div>;
    }

    return (
      <div className="bracket-container">
        {/*<SingleEliminationBracket*/}
        {/*  matches={matches}*/}
        {/*  matchComponent={CustomMatchComponent}*/}
        {/*  svgWrapper={({ children, ...props }) => (*/}
        {/*    <SVGViewer width={1000} height={800} {...props}>*/}
        {/*      {children}*/}
        {/*    </SVGViewer>*/}
        {/*  )}*/}
        {/*/>*/}
      </div>
    );
  };

  const CustomMatchComponent = ({ match }) => {
    const home = match.participants[0];
    const visitor = match.participants[1];
    const homeScore = home.resultText;
    const visitorScore = visitor.resultText;

    return (
      <div className="bracket-match">
        <div className="date">{new Date(match.startTime).toLocaleDateString()}</div>
        <div className="bracket-team">
          <img src={home.image} alt={`${home.name} logo`} className="user-image" />
          <div className={`team-name ${home.isWinner ? 'bold' : ''}`}>{home.name}</div>
          <div className={`score ${home.isWinner ? 'bold' : ''}`}>{homeScore}</div>
        </div>
        <div className="bracket-team">
          <img src={visitor.image} alt={`${visitor.name} logo`} className="user-image" />
          <div className={`team-name ${visitor.isWinner ? 'bold' : ''}`}>{visitor.name}</div>
          <div className={`score ${visitor.isWinner ? 'bold' : ''}`}>{visitorScore}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div className="bracket-page light">
        <header>
          <h1>대진표</h1>
        </header>
        <div className="content">
          <div className="filters">
            <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
              <option value="soccer">축구</option>
              <option value="basketball">농구</option>
              {/* Add more sports as needed */}
            </select>
            <div className="tabs">
              <button className={`tab-button ${activeTab === 'league' ? 'active' : ''}`} onClick={() => setActiveTab('league')}>
                리그
              </button>
              <button className={`tab-button ${activeTab === 'tournament' ? 'active' : ''}`} onClick={() => setActiveTab('tournament')}>
                토너먼트
              </button>
            </div>
          </div>
          {activeTab === 'league' ? renderLeagueTable() : renderTournamentBracket()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BracketPage;