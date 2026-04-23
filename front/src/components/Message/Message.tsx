import React from 'react';
import { MessageContainer, MessageText, MessageMeta } from './Message.styles';

interface MessageProps {
  text: string;
  sender: string;
  timestamp: string;
  isOwn?: boolean;
}

const Message: React.FC<MessageProps> = ({ text, sender, timestamp, isOwn = false }) => {
  return (
    <MessageContainer isOwn={isOwn}>
      <MessageText>{text}</MessageText>
      <MessageMeta>
        {sender}, {timestamp}
      </MessageMeta>
    </MessageContainer>
  );
};

export default Message;