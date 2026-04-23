import styled from 'styled-components';

export const InputContainer = styled.input<{ onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void }>`
  width: 374px;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;