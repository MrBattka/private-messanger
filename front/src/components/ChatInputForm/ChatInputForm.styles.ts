import styled from "styled-components";


export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
`;

export const ReplyPreview = styled.div`
  font-size: 0.85em;
  width: 100%;
  color: #007bff;
  padding: 6px 10px;
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
`;

export const ReplyContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ReplyUser = styled.span`
  flex-grow: 1;
  margin-left: 10px;
`;

export const ReplyText = styled.span`
  flex-grow: 1;
  color: black;
  margin-left: 10px;
`;

export const ReplyIcon = styled.span`
  margin-right: 8px;
  font-size: 22px;
`;

export const CancelReplyButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 1.2em;
  margin-left: auto;

  &:hover {
    color: #555;
  }
`;

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px 10px 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
`;