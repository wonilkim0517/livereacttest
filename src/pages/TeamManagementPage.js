import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import './TeamManagementPage.css';

const TeamManagementPage = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({ teamName: '', department: '', teamPoint: 0 });
  const [editTeam, setEditTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

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
    setNewTeam({ ...newTeam, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditTeam({ ...editTeam, [name]: value });
  };

  const handleAddTeam = async () => {
    try {
      await axiosInstance.post('/api/teams', newTeam);
      fetchTeams();
      setNewTeam({ teamName: '', department: '', teamPoint: 0 });
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handleEditTeam = async (team) => {
    setEditTeam(team);
  };

  const handleUpdateTeam = async () => {
    try {
      await axiosInstance.put(`/api/teams/${editTeam.teamId}`, editTeam);
      fetchTeams();
      setEditTeam(null);
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await axiosInstance.delete(`/api/teams/${teamId}`);
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  return (
    <div className="team-management-container">
      <h1>팀 관리</h1>
      <div className="team-list">
        {teams.map((team) => (
          <div key={team.teamId} className="team-item">
            {editTeam && editTeam.teamId === team.teamId ? (
              <>
                <input
                  type="text"
                  name="teamName"
                  value={editTeam.teamName}
                  onChange={handleEditInputChange}
                />
                <input
                  type="text"
                  name="department"
                  value={editTeam.department}
                  onChange={handleEditInputChange}
                />
                <input
                  type="number"
                  name="teamPoint"
                  value={editTeam.teamPoint}
                  onChange={handleEditInputChange}
                />
                <button onClick={handleUpdateTeam}>저장</button>
              </>
            ) : (
              <>
                <span>{team.teamName}</span>
                <span>{team.department}</span>
                <span>{team.teamPoint}</span>
                <button onClick={() => handleEditTeam(team)}>수정</button>
                <button onClick={() => handleDeleteTeam(team.teamId)}>삭제</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="add-team">
        <h2>팀 추가</h2>
        <input
          type="text"
          name="teamName"
          placeholder="팀 이름"
          value={newTeam.teamName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="department"
          placeholder="학과"
          value={newTeam.department}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="teamPoint"
          placeholder="팀 포인트"
          value={newTeam.teamPoint}
          onChange={handleInputChange}
        />
        <button onClick={handleAddTeam}>추가</button>
      </div>
    </div>
  );
};

export default TeamManagementPage;
