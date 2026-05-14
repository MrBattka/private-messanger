import { useState } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const useLoginForm = () => {
  const [values, setValues] = useState<FormValues>({ email: '', password: '' });
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);

  const validate = (values: FormValues): FormErrors => {
    const errors: FormErrors = {};

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Очистка ошибки при вводе
    if (touched[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate({ ...values, [name]: values[name as keyof FormValues] });
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name as keyof FormValues] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate(values);
    setErrors(formErrors);
    setTouched({
      email: true,
      password: true,
    });

    if (Object.keys(formErrors).length > 0) return;

    try {
      await login(values.email, values.password);
      navigate('/chat', { replace: true });
    } catch (err) {
      // Ошибка будет из authError из store
      console.error('Login failed:', err);
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