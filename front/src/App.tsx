import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './pages/AuthPage/LoginPage/LoginPage';
import RegisterPage from './pages/AuthPage/RegisterPage/RegisterPage';
import ChatPage from './pages/ChatPage/ChatPage';
import styled, { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import { useSettingStore } from './store/SettingStore';

const App: React.FC = () => {
  const { theme } = useSettingStore();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  
  return (
    <ThemeProvider theme={currentTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;