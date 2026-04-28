import React from 'react';
import { Link } from 'react-router-dom';
import AuthInput from '../../../components/AuthInput/AuthInput';
import { useLoginForm } from '../../../hooks/useLoginForm';
import { ErrorMessage, LinkText, LoginContainer, LoginForm, SubmitButton, Title } from './LoginPage.styles';

const LoginPage: React.FC = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isLoading,
    authError,
  } = useLoginForm();

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Login</Title>

        {authError && <ErrorMessage>{authError}</ErrorMessage>}

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