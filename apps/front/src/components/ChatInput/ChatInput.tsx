import React from 'react';
import { InputContainer } from './ChatInput.styles';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ChatInput: React.FC<InputProps> = ({ value, onChange, placeholder, type = 'text', onKeyPress }) => {
  return (
    <InputContainer
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyPress={onKeyPress}
    />
  );
};

export default ChatInput;