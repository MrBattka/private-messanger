import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import styled from 'styled-components';
import AuthInput from '../../components/AuthInput/AuthInput';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
`;

const RegisterForm = styled.form`
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
  margin: 0.25rem 0;
  text-align: left;
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

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, isLoading, error: authError } = useAuthStore(); // Получаем ошибку из хранилища
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username || !email || !password || !confirmPassword) {
      setLocalError('All fields are required');
      return;
    }

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const success = await register(username, email, password);

    if (success) {
      navigate('/login');
    }
}

  const displayError = localError || authError;

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <Title>Register</Title>

        {displayError && <ErrorMessage>{displayError}</ErrorMessage>}

        <AuthInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <AuthInput
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </SubmitButton>

        <LinkText>
          Already have an account? <Link to="/login">Login</Link>
        </LinkText>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default RegisterPage;