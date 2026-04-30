import styled from 'styled-components';

export const ThemeItemContainer = styled.div`
  padding: 10px 0;
  display: flex;
  align-items: center;
`;

export const ThemeLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: ${(props) => props.theme.text};
  cursor: pointer;
`;

export const Toggle = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 50px;
  height: 24px;
  background: ${(props) => props.theme.border};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;

  &:checked {
    background: ${props => props.theme.primary};
  }

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
  }

  &:checked::after {
    transform: translateX(26px);
  }
`;