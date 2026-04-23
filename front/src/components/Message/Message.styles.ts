import styled from 'styled-components';

interface MessageContainerProps {
  isOwn: boolean;
}

export const MessageContainer = styled.div<MessageContainerProps>`
  max-width: 70%;
  margin: 8px 0;
  padding: 10px 15px;
  border-radius: 18px;
  background-color: ${props => props.isOwn ? '#007bff' : '#f1f1f1'};
  color: ${props => props.isOwn ? 'white' : 'black'};
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  text-align: left;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

export const MessageText = styled.p`
  margin: 0;
  word-wrap: break-word;
`;

export const MessageMeta = styled.small`
  display: block;
  margin-top: 5px;
  opacity: 0.7;
  font-size: 0.8em;
`;