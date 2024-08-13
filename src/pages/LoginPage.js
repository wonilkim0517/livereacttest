import {useTheme} from "../contexts/ThemeContext";
import {Link, useNavigate} from "react-router-dom";
import logo from '../logo.png';
import {useState} from "react";
import axiosInstance from "../api/axiosInstance";
import './LoginPage.css';
import emailIcon from '../assets/email.png';
import passwordIcon from '../assets/Password.png';

const LoginPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/api/users/login', {
        email,
        password
      });
      // 로그인 성공 시 처리 (예: 토큰 저장, 사용자 정보 저장 등)
      console.log(response.data);
      const { role } = response.data;

      setOpenModal(false)

      if (role === 'ADMIN') {
        navigate('/adminmainpage'); // 관리자 메인 페이지로 이동
      } else {
        navigate('/mainpage'); // 일반 사용자 메인 페이지로 이동
      }
    } catch (error) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('Error logging in:', error);
    }
  };

  const handleForgotPassword = async () => {
    setForgotPasswordError('');
    setForgotPasswordMessage('');

    if (!email) {
      setForgotPasswordError('이메일을 입력해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/users/forgotPassword', null, {
        params: { email }
      });
      console.log(response.data);
      setForgotPasswordMessage('비밀번호 재설정 이메일이 전송되었습니다.');
    } catch (error) {
      setForgotPasswordError('비밀번호 재설정 이메일 전송에 실패했습니다. 다시 시도해주세요.');
      console.error('Error sending forgot password email:', error);
    }
  };
  return (
    <div className={`login-container ${theme}`}>
      <div className="logo-container">
        <div className="logo-background">
          <img src={logo} alt="Sahmyook University Logo" className="logo" />
        </div>
      </div>
      <button className="login-button" onClick={() => setOpenModal(true)}>로그인하기</button>
      <div className="signup-prompt">
        계정이 없으신가요? <Link to="/SignupScreen">회원가입</Link>을 눌러주세요
      </div>
      {openModal &&
        <div className={`modal-overlay ${openModal ? 'show' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <button className="close-button" onClick={() => setOpenModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="logo-container">
                <img src={logo} alt="Sahmyook University Logo" className="logo"/>

              </div>
              <form className="login-form" onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}>
                <div className="input-container">
                  <img src={emailIcon} alt="email icon" className="input-icon"/>
                  <input
                    type="email"
                    placeholder="e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <img src={passwordIcon} alt="password icon" className="input-icon"/>
                  <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="forgot-password-container">
                  <button type="button" className="forgot-password" onClick={handleForgotPassword}>비밀번호 찾기</button>
                </div>
                {forgotPasswordError && <div className="error-message">{forgotPasswordError}</div>}
                {forgotPasswordMessage && <div className="success-message">{forgotPasswordMessage}</div>}
                <button type="submit" className="login-button">로그인하기</button>
              </form>
              <div className="signup-prompt">
                계정이 없으신가요? <a href="/SignupScreen">회원가입</a>을 눌러주세요
              </div>
            </div>
          </div>
        </div>
      }
    </div>

  );
}

export default LoginPage;