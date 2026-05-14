import styled from 'styled-components';

export const InputContainer = styled.input<{ onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void }>`
  padding: 12px;
  border: 1px solid ${(props) => props.theme.colors.chatBackgroundWelcomeGradientEnd};
  border-radius: 6px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-right: 10px;
  background: ${(props) => props.theme.colors.chatBackgroundWelcomeGradientEnd};
  
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;