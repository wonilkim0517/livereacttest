import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import './MatchManagementPage.css';

const MatchManagementPage = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matchForm, setMatchForm] = useState({
    sport: 'SOCCER',
    date: '',
    startTime: '',
    matchType: 'LEAGUE',
    status: 'FUTURE',
    groupName: '',
    round: '',
    teamId1: '',
    teamId2: ''
  });
  const [editingMatchId, setEditingMatchId] = useState(null);

  const sports = {
    SOCCER: '축구',
    BADMINTON: '배드민턴',
    TABLE_TENNIS: '탁구',
    DODGEBALL: '피구'
  };

  const matchTypes = {
    LEAGUE: '리그',
    TOURNAMENT: '토너먼트'
  };

  const matchStatuses = {
    FUTURE: '예정',
    LIVE: '진행중',
    PAST: '종료'
  };

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axiosInstance.get('/api/matches/all');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axiosInstance.get('/api/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMatchForm({
      ...matchForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingMatchId) {
        await axiosInstance.put(`/api/matches/${editingMatchId}`, matchForm);
      } else {
        await axiosInstance.post('/api/matches', matchForm);
      }

      setMatchForm({
        sport: 'SOCCER',
        date: '',
        startTime: '',
        matchType: 'LEAGUE',
        status: 'FUTURE',
        groupName: '',
        round: '',
        teamId1: '',
        teamId2: ''
      });
      setEditingMatchId(null);
      fetchMatches();
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const handleEdit = (match) => {
    setMatchForm({
      sport: match.sport,
      date: match.date,
      startTime: match.startTime,
      matchType: match.matchType,
      status: match.status,
      groupName: match.groupName,
      round: match.round,
      teamId1: match.teamId1,
      teamId2: match.teamId2
    });
    setEditingMatchId(match.matchId);
  };

  const handleDelete = async (matchId) => {
    try {
      await axiosInstance.delete(`/api/matches/${matchId}`);
      fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  return (
    <div className="match-management-container">
      <h1>경기 관리</h1>

      <form className="match-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>팀 1</label>
          <select
            name="teamId1"
            value={matchForm.teamId1}
            onChange={handleInputChange}
            required
          >
            <option value="">팀 선택</option>
            {teams.map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>팀 2</label>
          <select
            name="teamId2"
            value={matchForm.teamId2}
            onChange={handleInputChange}
            required
          >
            <option value="">팀 선택</option>
            {teams.map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>스포츠</label>
          <select
            name="sport"
            value={matchForm.sport}
            onChange={handleInputChange}
            required
          >
            {Object.entries(sports).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>날짜</label>
          <input
            type="date"
            name="date"
            value={matchForm.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label>시작 시간</label>
          <input
            type="time"
            name="startTime"
            value={matchForm.startTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label>경기 타입</label>
          <select
            name="matchType"
            value={matchForm.matchType}
            onChange={handleInputChange}
            required
          >
            {Object.entries(matchTypes).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>상태</label>
          <select
            name="status"
            value={matchForm.status}
            onChange={handleInputChange}
            required
          >
            {Object.entries(matchStatuses).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>그룹명</label>
          <input
            type="text"
            name="groupName"
            value={matchForm.groupName}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label>라운드</label>
          <input
            type="text"
            name="round"
            value={matchForm.round}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="save-button">
          {editingMatchId ? '수정' : '추가'}
        </button>
      </form>

      <div className="match-list">
        <h2>경기 목록</h2>
        {matches.map((match) => (
          <div key={match.matchId} className="match-item">
            <span>{match.teamName1} vs {match.teamName2}</span>
            <span>{sports[match.sport]}</span>
            <span>{match.date}</span>
            <span>{match.startTime}</span>
            <span>{matchTypes[match.matchType]}</span>
            <span>{matchStatuses[match.status]}</span>
            <button onClick={() => handleEdit(match)}>수정</button>
            <button onClick={() => handleDelete(match.matchId)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchManagementPage;
