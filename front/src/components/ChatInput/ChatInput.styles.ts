import styled from 'styled-components';

export const InputContainer = styled.input<{ onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void }>`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-right: 10px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;