import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { validateRegisterForm } from './validators';
import { useAuthForm } from './useAuthForm';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error: authError } = useAuthStore();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setErrors,
  } = useAuthForm({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Помечаем все поля как touched
    Object.keys(values).forEach((key) => {
      handleBlur({
        target: { name: key },
      } as React.FocusEvent<HTMLInputElement>);
    });

    const formErrors = validateRegisterForm(values);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    const success = await register(
      values.username,
      values.email,
      values.password
    );

    if (success) {
      navigate('/chat');
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isLoading,
    authError,
  };
};