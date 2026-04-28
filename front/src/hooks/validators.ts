export const validateRegisterForm = (values: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors: Partial<Record<keyof typeof values, string>> = {};

  if (!values.username) errors.username = 'Username is required';
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};