import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MatchDetailPage.css';

const MatchDetailPage = () => {
  const { matchId, sports } = useParams();
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState(null);
  const [lineup, setLineup] = useState([]);
  const [activeTab, setActiveTab] = useState('details'); // 기본 탭은 'details'
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [leagueData, setLeagueData] = useState(null); // 리그 데이터 상태 추가
  const [tournamentData, setTournamentData] = useState(null); // 토너먼트 데이터 상태 추가

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`https://suportscore.site/api/matchTeams/${matchId}`);
        console.log('Match Details:', response.data); // 콘솔 로그 추가
        setMatchDetails(response.data);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  useEffect(() => {
    if (activeTab === 'lineup') {
      const fetchLineup = async () => {
        try {
          const response = await axios.get(`https://suportscore.site/api/lineup/${matchId}`);
          console.log('Lineup:', response.data); // 콘솔 로그 추가
          setLineup(response.data);
        } catch (error) {
          console.error('Error fetching lineup:', error);
        }
      };

      fetchLineup();
    } else if (activeTab === 'comments') {
      const fetchComments = async () => {
        try {
          const response = await axios.get(`https://suportscore.site/api/comments/${matchId}`);
          console.log('Comments:', response.data); // 콘솔 로그 추가
          setComments(response.data);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };

      fetchComments();
    }
  }, [activeTab, matchId]);

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const response = await axios.get(`https://suportscore.site/api/brackets/league/${sports}`);
        console.log('League Data:', response.data); // 콘솔 로그 추가
        setLeagueData(response.data);
      } catch (error) {
        console.error('Error fetching league data:', error);
      }
    };

    fetchLeagueData();
  }, [sports]);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await axios.get('https://suportscore.site/api/brackets/tournament');
        console.log('Tournament Data:', response.data); // 콘솔 로그 추가
        setTournamentData(response.data);
      } catch (error) {
        console.error('Error fetching tournament data:', error);
      }
    };

    fetchTournamentData();
  }, []);

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post('https://suportscore.site/api/comments', {
          matchId,
          text: newComment
        });
        console.log('New Comment:', response.data); // 콘솔 로그 추가
        setComments([...comments, response.data]);
        setNewComment('');
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'details') {
      return (
        <>
          <h2>역대 상대 전적</h2>
          <table className="table">
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
              {matchDetails && matchDetails.pastRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.department}</td>
                  <td>{record.win}</td>
                  <td>{record.draw}</td>
                  <td>{record.lose}</td>
                  <td>{record.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>학과별 전적</h2>
          {matchDetails && matchDetails.departmentRecords.map((department, index) => (
            <div key={index}>
              <h3>{department.department}</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>학과</th>
                    <th>승</th>
                    <th>무</th>
                    <th>패</th>
                  </tr>
                </thead>
                <tbody>
                  {department.records.map((record, idx) => (
                    <tr key={idx}>
                      <td>{record.opponent}</td>
                      <td>{record.win}</td>
                      <td>{record.draw}</td>
                      <td>{record.lose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {leagueData && (
            <>
              <h2>리그 데이터</h2>
              {leagueData.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h3>{group.groupName}</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Match ID</th>
                        <th>Sports</th>
                        <th>Match Date</th>
                        <th>Start Time</th>
                        <th>Match Type</th>
                        <th>Match Status</th>
                        <th>Team One</th>
                        <th>Score</th>
                        <th>Team Two</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.matches.map((match, matchIndex) => (
                        <tr key={matchIndex}>
                          <td>{match.matchId}</td>
                          <td>{match.sports}</td>
                          <td>{match.matchDate}</td>
                          <td>{match.startTime}</td>
                          <td>{match.matchType}</td>
                          <td>{match.matchStatus}</td>
                          <td>{match.teamOneName}</td>
                          <td>{match.teamOneScore}</td>
                          <td>{match.teamTwoName}</td>
                          <td>{match.teamTwoScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </>
          )}
          {tournamentData && (
            <>
              <h2>토너먼트 데이터</h2>
              {Object.keys(tournamentData).map((round, roundIndex) => (
                <div key={roundIndex}>
                  <h3>{round.replace('_', ' ')}</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Match ID</th>
                        <th>Sports</th>
                        <th>Match Date</th>
                        <th>Start Time</th>
                        <th>Match Type</th>
                        <th>Match Status</th>
                        <th>Team One</th>
                        <th>Score</th>
                        <th>Team Two</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournamentData[round].map((match, matchIndex) => (
                        <tr key={matchIndex}>
                          <td>{match.matchId}</td>
                          <td>{match.sports}</td>
                          <td>{match.matchDate}</td>
                          <td>{match.startTime}</td>
                          <td>{match.matchType}</td>
                          <td>{match.matchStatus}</td>
                          <td>{match.teamOneName}</td>
                          <td>{match.teamOneScore}</td>
                          <td>{match.teamTwoName}</td>
                          <td>{match.teamTwoScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </>
          )}
        </>
      );
    } else if (activeTab === 'lineup') {
      return (
        <div>
          {lineup.length > 0 ? lineup.map((team, index) => (
            <div key={index}>
              <h3>{team.department}</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>player</th>
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((player, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{player}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )) : <p>라인업 데이터가 없습니다.</p>}
        </div>
      );
    } else if (activeTab === 'comments') {
      return (
        <div className="comments-section">
          <h3>응원 댓글</h3>
          <div className="comments">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <span className="comment-user-icon">👤</span>
                <span className="comment-text">{comment.text}</span>
              </div>
            ))}
          </div>
          <div className="comment-input-section">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="채팅을 입력해 주세요 (최대 300자)"
              maxLength="300"
            />
            <button onClick={handleCommentSubmit} className="comment-submit-button">✈️</button>
          </div>
        </div>
      );
    }
  };

  if (!matchDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="match-detail-page">
      <Header />
      <button onClick={() => navigate(-1)} className="back-button">&lt;</button>
      <div className="match-detail-content">
        <h1>경기 자세히 보기</h1>
        <div className="tabs">
          <button className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>경기 전적</button>
          <button className={`tab-button ${activeTab === 'lineup' ? 'active' : ''}`} onClick={() => setActiveTab('lineup')}>라인업</button>
          <button className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>댓글</button>
        </div>
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MatchDetailPage;
