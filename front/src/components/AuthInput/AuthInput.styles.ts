import styled from 'styled-components';

export const InputContainer = styled.input<{
  $hasError?: boolean;
}>`
  width: 374px;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid ${(props) => (props.$hasError ? '#e74c3c' : '#ddd')};
  border-radius: 5px;
  font-size: 1rem;
  transition: border 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? '#c0392b' : '#667eea')};
  }
`;

export const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 0.875rem;
  margin: -0.25rem 0 0.5rem 0;
  display: block;
`;