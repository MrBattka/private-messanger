import React from 'react';
import { ButtonContainer } from './Button.styles';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return <ButtonContainer variant={variant} onClick={onClick}>{children}</ButtonContainer>;
};

export default Button;