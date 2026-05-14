import styled from "styled-components";

export const List = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-right: 10px;
`;

export const UserName = styled.span`
  font-size: 15px;
  color: ${props => props.theme.colors.chatText};
`;