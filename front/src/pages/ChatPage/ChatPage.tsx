import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInputForm from '../../components/ChatInputForm/ChatInputForm';
import ChatListTemp from '../../components/ChatListTemp/ChatListTemp';
import Message from '../../components/Message/Message';
import UserMiniAvatar from '../../components/User/UserMiniAvatar/UserMiniAvatar';
import { useChatInitialization } from '../../hooks/useChatInitialization';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useScrollManagement } from '../../hooks/useScrollManagement';
import { useReplyManagement } from '../../hooks/useReplyManagement';
import { useAuthStore } from '../../store/AuthStore';
import { useChatStore } from '../../store/chatStore';
import { ChatContainer, FlexContainer, MessageList, PlugNoMessage, PlugSelectChat, ScrollToBottomButton, Sidebar } from './ChatPage.styles';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore(); // ← Получаем user здесь
  const { selectedChatId, addMessage, messages } = useChatStore();

  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { messageListRef, showScrollDown, scrollToBottom } = useScrollManagement(messages, selectedChatId);
  const { replyTo, replyToId, setReplyTo, setReplyToId, handleReplyClick, onClearReply } = useReplyManagement();

  useChatInitialization();
  useChatMessages(selectedChatId);

  const handleQuoteClick = (quotedMessageId: string | number) => {
    const targetId = String(quotedMessageId);
    const originalMsg = messages.find(m => m.id === targetId);
    if (!originalMsg) {
      console.warn(`Message with id ${targetId} not found`);
      return;
    }

    const element = messageRefs.current[targetId];
    if (!element) {
      console.warn(`Ref not found for message ${targetId}`);
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.style.transition = 'background-color 1s ease-out';
    element.style.backgroundColor = originalMsg.isOwn ? '#0056b3' : '#d1ecf1';

    setTimeout(() => {
      element.style.backgroundColor = '';
    }, 1000);
  };

  const handleSendMessage = useCallback((content: string) => {
    if (!selectedChatId || !user) return;

    addMessage({
      id: Date.now().toString(),
      content,
      sender: user.username || 'Вы',
      chatId: selectedChatId,
      userId: Number(user.id),
      isOwn: true,
      timestamp: new Date().toISOString(),
      replyToId: replyToId || null,
    });

    setReplyTo(null);
    setReplyToId(null);
  }, [selectedChatId, user, addMessage, replyToId, setReplyTo, setReplyToId]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <FlexContainer>
      <Sidebar>
        <UserMiniAvatar />
        <ChatListTemp />
      </Sidebar>

      {selectedChatId ? (
  <ChatContainer>
    <MessageList
      ref={messageListRef}
      key={selectedChatId}
      role="log"
      aria-live="polite"
    >
      {messages.filter((msg) => msg.chatId === selectedChatId).length > 0 ? (
        messages
          .filter((msg) => msg.chatId === selectedChatId)
          .map((msg) => (
            <Message
              key={msg.id}
              content={msg.content}
              sender={msg.sender}
              timestamp={msg.timestamp}
              isOwn={msg.isOwn}
              replyTo={msg.replyTo}
              replyToId={msg.replyToId}
              onReply={() => handleReplyClick(msg)}
              messageId={msg.id}
              onQuoteClick={handleQuoteClick}
              ref={(el) => {
                messageRefs.current[msg.id] = el;
              }}
            />
          ))
      ) : (
        <PlugNoMessage>
          <span>Здесь пока нету сообщений</span>
        </PlugNoMessage>
      )}
    </MessageList>
    {showScrollDown && (
      <ScrollToBottomButton
        $visible={showScrollDown}
        $replyActive={!!replyTo} // ← добавь эту строку
        onClick={scrollToBottom}
        aria-label="Scroll to latest messages"
      >
        🡻
      </ScrollToBottomButton>
    )}
    <ChatInputForm
      onSendMessage={handleSendMessage}
      replyTo={replyTo}
      onClearReply={onClearReply}
    />
  </ChatContainer>
) : (
  <PlugSelectChat>
    <span>🤫 Welcome in secret messenger 🤐</span>
  </PlugSelectChat>
)}
    </FlexContainer>
  );
};

export default ChatPage;