import React from 'react';
import { InputContainer, ErrorText } from './AuthInput.styles';

interface AuthInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string; // <-- новое!
}

const AuthInput: React.FC<AuthInputProps> = ({
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  name,
  onKeyPress,
  required = false,
  disabled = false,
  error,
}) => {
  return (
    <div>
      <InputContainer
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        name={name} // важно для handleBlur и handleChange
        onKeyPress={onKeyPress}
        required={required}
        disabled={disabled}
        $hasError={!!error} // передаём флаг ошибки в styled-component
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export default AuthInput;