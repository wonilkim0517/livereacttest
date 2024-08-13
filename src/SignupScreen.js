import React, { useState } from 'react';
import axiosInstance from './api/axiosInstance';
import './SignupScreen.css';
import pwdIcon from '../src/assets/pwd.png'; 
import { useNavigate } from 'react-router-dom';

const SignupScreen = () => {
    const [agreeAll, setAgreeAll] = useState(false);
    const [terms, setTerms] = useState({
        term1: false,
        term2: false,
        term3: false,
        term4: false,
        term5: false,
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [name, setName] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [emailCheckMessage, setEmailCheckMessage] = useState("");
    const [nickname, setNickname] = useState("");
    const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");
    const [isNicknameUnique, setIsNicknameUnique] = useState(false);
    const [username, setUsername] = useState(""); // 추가
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleAgreeAllChange = () => {
        const newAgreeAll = !agreeAll;
        setAgreeAll(newAgreeAll);
        setTerms({
            term1: newAgreeAll,
            term2: newAgreeAll,
            term3: newAgreeAll,
            term4: newAgreeAll,
            term5: newAgreeAll,
        });
    };

    const handleTermChange = (term) => {
        const newTerms = { ...terms, [term]: !terms[term] };
        setTerms(newTerms);
        const allChecked = Object.values(newTerms).every(value => value);
        setAgreeAll(allChecked);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setPassword(value);
        if (value.length < 8 || value.length > 16) {
            setPasswordError("비밀번호는 8~16자 사이여야 합니다.");
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setConfirmPassword(value);
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleEmailVerification = async () => {
        try {
            const response = await axiosInstance.post('/api/users/sendVerificationCode', null, { 
                params: { email } 
            });
            console.log(response.data);
            setVerificationSent(true);
        } catch (error) {
            console.error('Error sending verification code:', error);
        }
    };

    const handleVerificationCodeCheck = async () => {
        try {
            const response = await axiosInstance.post('/api/users/verifyCode', null, {
                params: { email, code: verificationCode }
            });
            console.log(response.data);
            if (response.data) {
                setIsEmailVerified(true);
            }
        } catch (error) {
            console.error('Error verifying code:', error);
        }
    };

    const handleEmailCheck = async () => {
        try {
            const response = await axiosInstance.get('/api/users/checkEmail', { 
                params: { email } 
            });
            console.log(response.data);
            if (response.data) {
                setEmailCheckMessage("이미 사용 중인 이메일입니다.");
            } else {
                setEmailCheckMessage("사용 가능한 이메일입니다.");
            }
        } catch (error) {
            console.error('Error checking email:', error.response ? error.response.data : error.message);
            setEmailCheckMessage("이메일 확인 중 오류가 발생했습니다.");
        }
    };

    const handleNicknameCheck = async () => {
        try {
            const response = await axiosInstance.get('/api/users/checkNickname', { 
                params: { nickname } 
            });
            console.log(response.data);
            if (response.data) {
                setNicknameCheckMessage("이미 사용 중인 닉네임입니다.");
                setIsNicknameUnique(false);
            } else {
                setNicknameCheckMessage("사용 가능한 닉네임입니다.");
                setIsNicknameUnique(true);
            }
        } catch (error) {
            console.error('Error checking nickname:', error.response ? error.response.data : error.message);
            setNicknameCheckMessage("닉네임 확인 중 오류가 발생했습니다.");
            setIsNicknameUnique(false);
        }
    };

    const handleNicknameSubmit = async () => {
        if (!isNicknameUnique) {
            setNicknameCheckMessage("닉네임 중복 확인을 해주세요.");
            return;
        }

        try {
            const response = await axiosInstance.post('/api/users/register', {
                email,
                password,
                name,
                terms,
                nickname,
                username // 추가
            });
            console.log(response.data);
            navigate('/'); // Go back to the main screen
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="signup-container">
            {step === 1 && (
                <form className="signup-form" onSubmit={handleNextStep}>
                    <h1>회원가입</h1>
                    <label>이메일 *</label>
                    <div className="email-container">
                        <input 
                            type="email" 
                            placeholder="예) abc@gmail.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                        <button type="button" className="check-button" onClick={handleEmailCheck}>중복 확인</button>
                    </div>
                    {emailCheckMessage && <div className="email-check-message">{emailCheckMessage}</div>}
                    
                    {isEmailVerified ? (
                        <span>이메일 인증 완료</span>
                    ) : (
                        <div>
                            <button type="button" className="verify-button" onClick={handleEmailVerification}>
                                {verificationSent ? "코드 재전송" : "인증 코드 받기"}
                            </button>
                            {verificationSent && (
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="인증 코드를 입력하세요" 
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                    />
                                    <button type="button" onClick={handleVerificationCodeCheck}>인증하기</button>
                                </div>
                            )}
                        </div>
                    )}

                    <label>비밀번호 *</label>
                    <div className="password-container">
                        <input 
                            type={passwordVisible ? "text" : "password"} 
                            placeholder="영문, 숫자 조합 8~16자" 
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <img 
                            src={pwdIcon} 
                            alt="password icon" 
                            className="password-icon" 
                            onClick={togglePasswordVisibility} 
                        />
                    </div>
                    {passwordError && <div className="error">{passwordError}</div>}

                    <label>비밀번호 확인*</label>
                    <div className="password-container">
                        <input 
                            type={confirmPasswordVisible ? "text" : "password"} 
                            placeholder="비밀번호를 한 번 더 입력해주세요." 
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                        <img 
                            src={pwdIcon} 
                            alt="password icon" 
                            className="password-icon" 
                            onClick={toggleConfirmPasswordVisibility} 
                        />
                    </div>
                    {password !== confirmPassword && confirmPassword.length > 0 && (
                        <div className="error">비밀번호가 일치하지 않습니다.</div>
                    )}

                    <label>이름*</label>
                    <input 
                        type="text" 
                        placeholder="예) 홍길동" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />

                    <div className="terms">
                        <input 
                            type="checkbox" 
                            id="agree-all" 
                            checked={agreeAll} 
                            onChange={handleAgreeAllChange} 
                        />
                        <label htmlFor="agree-all">아래 약관에 모두 동의합니다.</label>

                        <div className="term-item">
                            <input 
                                type="checkbox" 
                                id="term1" 
                                checked={terms.term1} 
                                onChange={() => handleTermChange('term1')} 
                            />
                            <label htmlFor="term1">이용약관 필수 동의</label>
                        </div>

                        <div className="term-item">
                            <input 
                                type="checkbox" 
                                id="term2" 
                                checked={terms.term2} 
                                onChange={() => handleTermChange('term2')} 
                            />
                            <label htmlFor="term2">개인정보 처리방침 필수 동의</label>
                        </div>

                        <div className="term-item">
                            <input 
                                type="checkbox" 
                                id="term3" 
                                checked={terms.term3} 
                                onChange={() => handleTermChange('term3')} 
                            />
                            <label htmlFor="term3">위치정보 이용 약관 필수 동의</label>
                        </div>

                        <div className="term-item">
                            <input 
                                type="checkbox" 
                                id="term4" 
                                checked={terms.term4} 
                                onChange={() => handleTermChange('term4')} 
                            />
                            <label htmlFor="term4">마케팅 정보 수신 선택 동의</label>
                        </div>

                        <div className="term-item">
                            <input 
                                type="checkbox" 
                                id="term5" 
                                checked={terms.term5} 
                                onChange={() => handleTermChange('term5')} 
                            />
                            <label htmlFor="term5">만 14세 이상임에 필수 동의</label>
                        </div>
                    </div>

                    <button type="submit" className="next-button">다음</button>
                </form>
            )}

            {step === 2 && (
                <div className="nickname-container">
                    <h1>닉네임 설정</h1>
                    <label>닉네임 *</label>
                    <div className="nickname-input-container">
                        <input 
                            type="text" 
                            placeholder="10 글자 이내로 설정해주세요." 
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            maxLength="10"
                            required
                        />
                        <button type="button" className="check-button" onClick={handleNicknameCheck}>중복 확인</button>
                    </div>
                    {nicknameCheckMessage && <div className="nickname-check-message">{nicknameCheckMessage}</div>}

                    <button type="button" className="complete-button" onClick={handleNicknameSubmit}>완료</button>
                </div>
            )}
        </div>
    );
};

export default SignupScreen;
