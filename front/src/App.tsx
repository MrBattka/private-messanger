import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './pages/AuthPage/LoginPage/LoginPage';
import RegisterPage from './pages/AuthPage/RegisterPage/RegisterPage';
import ChatPage from './pages/ChatPage/ChatPage';
import styled from 'styled-components';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;