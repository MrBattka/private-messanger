import styled from 'styled-components';

export const SidebarTab = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.colors.chatBackground};
  overflow: hidden;
`;

export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.borderChat};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  background: ${props => props.$active 
    ? props.theme.colors.primary 
    : 'transparent'};
  color: ${props => props.$active 
    ? 'white' 
    : props.theme.colors.text};
  border: none;
  cursor: pointer;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  transition: all 0.2s;

  &:hover {
    background: ${props => !props.$active && 'rgba(100, 100, 200, 0.1)'};
  }
`;