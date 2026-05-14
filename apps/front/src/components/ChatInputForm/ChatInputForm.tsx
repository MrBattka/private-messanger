import React, { useState } from 'react';
import { SendButton } from '../../pages/ChatPage/ChatPage.styles';
import ChatInput from '../ChatInput/ChatInput';
import { CancelReplyButton, FlexContainer, InputContainer, ReplyContentContainer, ReplyIcon, ReplyPreview, ReplyText, ReplyUser } from './ChatInputForm.styles';

// Интерфейс для цитируемого сообщения
interface ReplyTo {
  sender: string;
  content: string;
}

interface ChatInputFormProps {
  onSendMessage: (content: string) => void;
  replyTo?: ReplyTo | null;
  onClearReply?: () => void;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSendMessage, replyTo, onClearReply }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      if (onClearReply) onClearReply(); // сброс цитаты после отправки
    }
  };

  return (
    <FlexContainer>
      {/* Превью ответа */}
      {replyTo && (
        <ReplyPreview>
          <ReplyIcon>↪</ReplyIcon>
          <ReplyContentContainer>
            <ReplyUser>
               Ответ: <strong>{replyTo.sender}</strong>
            </ReplyUser>
            <ReplyText>
              {replyTo.content.length > 30 
                ? replyTo.content.substring(0, 30) + '...' 
                : replyTo.content}
            </ReplyText>
          </ReplyContentContainer>
          <CancelReplyButton
            onClick={onClearReply}
            aria-label="Cancel reply"
          >
            ×
          </CancelReplyButton>
        </ReplyPreview>
      )}

      <InputContainer>
        <ChatInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Напишите сообщение..."
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <SendButton onClick={handleSubmit}>Отправить</SendButton>
        </InputContainer>
    </FlexContainer>
  );
};

export default ChatInputForm;