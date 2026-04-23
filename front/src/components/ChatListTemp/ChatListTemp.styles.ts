import styled from 'styled-components';

export const ChatListContainer = styled.div`
  width: 250px;
  border-right: 1px solid #e0e0e0;
  padding: 10px;
  height: 90%;
  overflow-y: auto;
  background-color: #ffffff;
`;

export const Title = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
`;

export const ChatItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 5px;
  background-color: ${({ isSelected }) => (isSelected ? '#e0f0ff' : '#f0f0f0')};
  border-radius: 6px;
  cursor: pointer;
  border-left: 3px solid ${({ isSelected }) => (isSelected ? '#007bff' : 'transparent')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? '#d0e8ff' : '#e0e0e0')};
  }
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #007bff;
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
  background-color: green;
  border-radius: 50%;
  border: 2px solid white;
`;

export const ChatInfo = styled.div`
  flex: 1;
`;

export const ChatName = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 15px;
`;

export const LastMessage = styled.div`
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Timestamp = styled.div`
  font-size: 12px;
  color: #999;
  text-align: right;
  min-width: 40px;
`;

export const UnreadBadge = styled.div`
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
`;