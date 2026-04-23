import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AuthInput from '../../components/AuthInput/AuthInput';
import { useAuthStore } from '../../store/AuthStore';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
`;

const LoginForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
  font-size: 1.8rem;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin: 0 0 1rem;
  text-align: center;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LinkText = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.9rem;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasNavigatedRef = useRef(false); // Флаг для предотвращения повторной навигации

  useEffect(() => {
    if (isAuthenticated && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      navigate('/chat', { replace: true });
    }
  }, [isAuthenticated]); // Убрал navigate из зависимостей, так как он стабильный

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
    }
  }, [email, password, login]); // login должен быть стабильным из useAuthStore

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Login</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={false}
        />
        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={false}
        />
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </SubmitButton>
        <LinkText>
          Don't have an account? <Link to="/register">Register</Link>
        </LinkText>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;