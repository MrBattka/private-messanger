import { useState } from 'react';
import { ReplyTo, ChatMessage } from '../store/chatStore';

export const useReplyManagement = () => {
  const [replyTo, setReplyTo] = useState<ReplyTo | null>(null);
  const [replyToId, setReplyToId] = useState<number | null>(null);

  const handleReplyClick = (message: ChatMessage) => {
    setReplyTo({
      sender: message.sender,
      content: message.content,
    });
    setReplyToId(parseInt(message.id));
  };

  const onClearReply = () => {
    setReplyTo(null);
    setReplyToId(null);
  };

  return { replyTo, replyToId, setReplyTo, setReplyToId, handleReplyClick, onClearReply };
};