import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import logo from './logo.png';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import routes from "./routes";

// LoginScreen 컴포넌트 정의
const LoginScreen = ({ onOpenModal }) => {
    const { theme } = useTheme();
    return (
        <div className={`login-container ${theme}`}>
            <div className="logo-container">
                <div className="logo-background">
                    <img src={logo} alt="Sahmyook University Logo" className="logo" />
                </div>
            </div>
            <button className="login-button" onClick={onOpenModal}>로그인하기</button>
            <div className="signup-prompt">
                계정이 없으신가요? <Link to="/SignupScreen">회원가입</Link>을 눌러주세요
            </div>
        </div>
    );
};

// App 컴포넌트 정의
const App = () => {

    const renderRoutes = (routes) => {
        return routes.map((route, index) => {
            if (route.children) {
                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                    >
                        {renderRoutes(route.children)}
                    </Route>
                );
            }

            return (
                <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                    exact={route.exact}
                />
            );
        });
    };

    return (
        <Router>
            <ThemeProvider>
                <Routes>
                    {renderRoutes(routes)}
                </Routes>
            </ThemeProvider>
        </Router>
    );
};

export default App;
