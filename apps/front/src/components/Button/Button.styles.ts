import styled from 'styled-components';

interface ButtonContainerProps {
  variant: 'primary' | 'secondary';
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  padding: 8px 14px;
  border: none;
  border-radius: 25px;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  height: 40px;

  background: ${props => 
    props.variant === 'primary' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
  };
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;