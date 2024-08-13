import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import './MyPage.css';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [nickname, setNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
  const [isNicknameUnique, setIsNicknameUnique] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/api/users/me');
        setUserInfo(response.data);
        setNickname(response.data.nickname); // 기존 닉네임 설정
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleNicknameCheck = async () => {
    try {
      const response = await axiosInstance.get('/api/users/checkNickname', { 
        params: { nickname } 
      });
      if (response.data) {
        setNicknameCheckMessage("이미 사용 중인 닉네임입니다.");
        setIsNicknameUnique(false);
      } else {
        setNicknameCheckMessage("사용 가능한 닉네임입니다.");
        setIsNicknameUnique(true);
      }
    } catch (error) {
      console.error('Error checking nickname:', error);
      setNicknameCheckMessage("닉네임 확인 중 오류가 발생했습니다.");
      setIsNicknameUnique(false);
    }
  };

  const handleUpdateUser = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const updateUserRequest = {
        email: userInfo.email,
        username: userInfo.username,
        nickname,
        password: newPassword
      };

      await axiosInstance.post('/api/users/update', updateUserRequest);
      alert("사용자 정보가 업데이트되었습니다.");
      setNewPassword('');
      setConfirmNewPassword('');
      window.location.href = '/';
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/users/logout');
      // 로그아웃 후 메인 페이지로 이동
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete('/api/users/delete');
      // 회원 탈퇴 후 메인 페이지로 이동
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      <div className="user-info">
        <p><strong>이메일:</strong> {userInfo.email}</p>
        <p><strong>이름:</strong> {userInfo.username}</p>
        <div className="nickname-container">
          <label><strong>닉네임:</strong></label>
          <input 
            type="text" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)}
            maxLength="10"
            required 
          />
          <button type="button" onClick={handleNicknameCheck}>중복 확인</button>
          {nicknameCheckMessage && <div className="nickname-check-message">{nicknameCheckMessage}</div>}
        </div>
      </div>
      <div className="password-change-container">
        <h2>비밀번호 변경</h2>
        <label>새 비밀번호</label>
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
        />
        <label>새 비밀번호 확인</label>
        <input 
          type="password" 
          value={confirmNewPassword} 
          onChange={(e) => setConfirmNewPassword(e.target.value)} 
        />
      </div>
      <button onClick={handleUpdateUser} className="update-button">저장</button>
      <button onClick={handleLogout} className="logout-button">로그아웃</button>
      <button onClick={handleDeleteAccount} className="delete-button">회원 탈퇴</button>
    </div>
  );
};

export default MyPage;
