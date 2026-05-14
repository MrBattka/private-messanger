import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthInput from '../../../components/AuthInput/AuthInput';
import Preloader from '../../../components/Preloader/Preloader';
import { useRegisterForm } from '../../../hooks/useRegisterForm';
import { useAuthStore } from '../../../store/AuthStore';
import { ErrorMessage, LinkText, RegisterContainer, RegisterForm, SubmitButton, Title } from './RegisterPage.styles';

const RegisterPage: React.FC = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isLoading,
    authError,
  } = useRegisterForm();

  const { isAuthenticated, isInitialized } = useAuthStore();
  const navigate = useNavigate()
  

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate])

    if (!isInitialized) {
      return (
        <RegisterContainer>
          <Preloader />
        </RegisterContainer>
      );
    }
  
    if (isAuthenticated) {
      return (
        <RegisterContainer>
          <Preloader />
        </RegisterContainer>
      );
    }

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <Title>Register</Title>

        {authError && <ErrorMessage>{authError}</ErrorMessage>}

        <AuthInput
          type="text"
          placeholder="Username"
          name="username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.username ? errors.username : undefined}
          required
          disabled={isLoading}
        />

        <AuthInput
          type="email"
          placeholder="Email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          required
          disabled={isLoading}
        />

        <AuthInput
          type="password"
          placeholder="Password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : undefined}
          required
          disabled={isLoading}
        />

        <AuthInput
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
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