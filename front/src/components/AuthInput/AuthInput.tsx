import React from 'react';
import { InputContainer } from './AuthInput.styles';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required: boolean
  disabled: boolean
}

const AuthInput: React.FC<InputProps> = ({ value, onChange, placeholder, type = 'text', onKeyPress, required, disabled }) => {
  return (
    <InputContainer
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyPress={onKeyPress}
      required={required}
      disabled={disabled}
    />
  );
};

export default AuthInput;