import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInput from '../../components/ChatInput/ChatInput';
import ChatListTemp from '../../components/ChatListTemp/ChatListTemp';
import Message from '../../components/Message/Message';
import { useAuthStore } from '../../store/AuthStore';
import { useChatStore } from '../../store/chatStore';
import { ChatContainer, FlexContainer, InputContainer, MessageList, PlugSelectChat, SendButton, Sidebar } from './ChatPage.styles';
import UserMiniAvatar from '../../components/User/UserMiniAvatar/UserMiniAvatar';

// Простой Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in ChatPage:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Что-то пошло не так. Попробуйте перезагрузить страницу.</h1>;
    }

    return this.props.children;
  }
}

const ChatPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const selectedChatId = useChatStore((state) => state.selectedChatId);
  const addMessage = useChatStore((state) => state.addMessage);
  const initSocket = useChatStore((state) => state.initSocket);
  const loadChats = useChatStore((state) => state.loadChats);
  const loadUsers = useChatStore((state) => state.loadUsers);
  const loadMessages = useChatStore((state) => state.loadMessages); // <-- добавляем
  const messages = useChatStore((state) => state.messages);
  const socket = useChatStore((state) => state.socket);
  
  const navigate = useNavigate();
  const hasNavigatedRef = useRef(false);

  const memoizedUser = useMemo(() => user, [user?.id, user?.username, user?.email, user?.avatarUrl]);

  // Инициализация: загрузка чатов, пользователей и т.д.
  useEffect(() => {
    if (hasInitialized) return;

    if (!isAuthenticated || !memoizedUser || !memoizedUser.id) {
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigate('/login');
      }
      return;
    }

    const userId = typeof memoizedUser.id === 'number' ? memoizedUser.id : parseInt(memoizedUser.id, 10);

    initSocket(userId);
    loadChats(userId);
    loadUsers();
    setHasInitialized(true);
  }, [hasInitialized, isAuthenticated, memoizedUser]);

  // 🔥 Загрузка сообщений при выборе чата
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId); // <-- Вот она — загрузка истории
    }
  }, [selectedChatId, loadMessages]);

  // Присоединение к чату через сокет
  useEffect(() => {
    if (selectedChatId && socket && memoizedUser && memoizedUser.id) {
      const userId = typeof memoizedUser.id === 'string' ? parseInt(memoizedUser.id) : memoizedUser.id;
      socket.emit('join_chat', selectedChatId, userId);
    }
  }, [selectedChatId, socket, memoizedUser]);

  const handleSend = () => {
    if (!inputValue.trim() || !selectedChatId || !memoizedUser || !memoizedUser.id) return;

    const userId = typeof memoizedUser.id === 'string' ? parseInt(memoizedUser.id) : memoizedUser.id;

    addMessage({
      content: inputValue,
      sender: memoizedUser.username || 'Вы',
      chatId: selectedChatId,
      userId: userId,
      isOwn: true,
    });

    setInputValue('');
  };

  if (!isAuthenticated || !memoizedUser) {
    return null;
  }

  return (
    <ErrorBoundary>
      <FlexContainer>
        <Sidebar>
          <UserMiniAvatar />
          <ChatListTemp />
        </Sidebar>
        {selectedChatId ? <ChatContainer>
          <MessageList>
            {messages.filter(msg => msg.chatId === selectedChatId).map((msg) => (
              <Message
                key={msg.id}
                text={msg.content}
                sender={msg.sender}
                timestamp={msg.timestamp}
                isOwn={msg.isOwn}
              />
            ))}
          </MessageList>
          <InputContainer>
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Напишите сообщение..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <SendButton onClick={handleSend}>Отправить</SendButton>
          </InputContainer>
        </ChatContainer> :
        <PlugSelectChat><span>🤫 Welcome in secret messenger 🤐</span></PlugSelectChat>}
      </FlexContainer>
    </ErrorBoundary>
  );
};

export default ChatPage;