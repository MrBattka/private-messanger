import styled from 'styled-components';

export const ChatListContainer = styled.div`
  border-right: 1px solid ${(props) => props.theme.colors.borderChat};
  padding: 10px;
  flex: 1;
  overflow-y: auto;
  background: ${(props) => props.theme.colors.chatBackground};
  height: 100%;
`;

export const Title = styled.h4`
  margin: 0 0 10px 0;
  color: ${props => props.theme.colors.chatText};
`;

export const UnreadTotal = styled.span`
  margin-left: 8px;
  background-color: #ff4d4f;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 12px;
  padding: 2px 6px;
  min-width: 18px;
  text-align: center;
  line-height: 1;
`;

export const ChatItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 5px;
  background-color: ${({ $isSelected }) => ($isSelected ? '#e0f0ff' : '#f0f0f0')};
  background-color: ${props =>
    props.$isSelected
      ? props.theme.colors.chatItemActive
      : props.theme.colors.chatItemBackground
  };
  border-radius: 6px;
  cursor: pointer;
  
  border-left: 3px solid ${props =>
    props.$isSelected
      ? props.theme.colors.chatItemBorder
      : 'transparent'
  };
  transition: background-color 0.4s ease;

  &:hover {
    background-color: ${props =>
    props.$isSelected
      ? props.theme.colors.chatItemHover
      : props.theme.colors.chatItemBackground === '#f0f0f0'
        ? '#e0e0e0'
        : props.theme.colors.chatItemHover
  };
  }
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 10px;
  position: relative;
`;

export const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  color: ${props => props.theme.colors.chatText};
  border-radius: 50%;
  border: 2px solid white;
`;

export const ChatInfo = styled.div`
  flex: 1;
`;

export const ChatName = styled.div`
  font-weight: bold;
  color: ${props => props.theme.colors.chatText};
  font-size: 15px;
`;

export const LastMessage = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Timestamp = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.text};
  text-align: right;
  min-width: 40px;
`;

export const UnreadBadge = styled.div`
  margin-left: 10px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
`;