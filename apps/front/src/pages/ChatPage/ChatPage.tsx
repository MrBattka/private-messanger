import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInputForm from '../../components/ChatInputForm/ChatInputForm';
import ChatListTemp from '../../components/ChatListTemp/ChatListTemp';
import Message from '../../components/Message/Message';
import Preloader from '../../components/Preloader/Preloader';
import UserMiniAvatar from '../../components/User/UserMiniAvatar/UserMiniAvatar';
import { useChatInitialization } from '../../hooks/useChatInitialization';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useReplyManagement } from '../../hooks/useReplyManagement';
import { useScrollManagement } from '../../hooks/useScrollManagement';
import { useAuthStore } from '../../store/AuthStore';
import { useChatStore } from '../../store/chatStore';
import { ChatContainer, FlexContainer, MessageList, PlugNoMessage, PlugSelectChat, ScrollToBottomButton, Sidebar } from './ChatPage.styles';
import Setting from '../../components/Setting/Setting';
import { useSettingStore } from '../../store/SettingStore';
import { useNotificationSound } from '../../hooks/useNotificationSound';
import ChatSidebar from '../../components/ChatSidebar/ChatSidebar';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isInitialized, isLoading } = useAuthStore();
  const { 
    selectedChatId, addMessage, messages, isLoadingMessages, 
    tempTargetUserId, setTempTargetUser, selectChat, loadChats,
    createPrivateChat, loadMessages
        } = useChatStore();

  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { messageListRef, showScrollDown, scrollToBottom } = useScrollManagement(messages, selectedChatId);
  const { replyTo, replyToId, setReplyTo, setReplyToId, handleReplyClick, onClearReply } = useReplyManagement();

  useChatInitialization();
  useChatMessages(selectedChatId); // ← вызывает loadMessages при изменении selectedChatId

  const handleQuoteClick = (quotedMessageId: string | number) => {
    const targetId = String(quotedMessageId);
    const originalMsg = messages.find(m => m.id === targetId);

    if (!originalMsg) return;

    const element = messageRefs.current[targetId];
    if (!element) return;

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.style.backgroundColor = originalMsg.isOwn ? '#0056b3' : '#d1ecf1';

    setTimeout(() => {
      element.style.backgroundColor = '';
    }, 1000);
  };

  const { isOpen } = useSettingStore()
  const { playSound } = useNotificationSound();
     
useEffect(() => {
  let originalTitle = document.title;
  let interval: NodeJS.Timeout | null = null;

  const unsubscribe = useChatStore.subscribe(
    (state) => ({
      selectedChatId: state.selectedChatId,
      messages: state.messages,
      lastSeen: state.lastSeen,
    }),
    ({ selectedChatId, messages, lastSeen }) => {
      if (!selectedChatId || messages.length === 0) return;

      // Сортируем по времени
      const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const latestMessage = sortedMessages[sortedMessages.length - 1];
      if (!latestMessage) return;

      // Пропускаем свои
      if (latestMessage.isOwn) return;

      // Пропускаем, если чат уже был просмотрен после этого сообщения
      const lastSeenTime = lastSeen[latestMessage.chatId];
      if (lastSeenTime && new Date(latestMessage.timestamp) <= new Date(lastSeenTime)) {
        return;
      }

      // Если сообщение из текущего чата — просто помечаем как виденное, без звука
      if (latestMessage.chatId === selectedChatId) {
        useChatStore.getState().markChatAsSeen(latestMessage.chatId);
        return;
      }

      // Только если сообщение из другого чата И пришло после последнего просмотра
      playSound();
      document.title = '❗ Новое сообщение';
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        document.title =
          document.title === '❗ Новое сообщение' ? originalTitle : '❗ Новое сообщение';
      }, 1000);
    }
  );

  return () => {
    if (interval) clearInterval(interval);
    document.title = originalTitle;
    unsubscribe();
  };
}, [playSound]);

useEffect(() => {
  const userId = useAuthStore.getState().user?.id;
  if (userId) {
    useChatStore.getState().initSocket(userId);
    useChatStore.getState().loadChats(userId);
  }
}, [user]);
  

const handleSendMessage = useCallback(async (content: string) => {
  if (!user || !content.trim()) return;

  const myId = Number(user.id);
  const socket = useChatStore.getState().socket;

  // Случай: создание нового чата
  if (selectedChatId === -1 && tempTargetUserId) {
    try {
      const targetId = tempTargetUserId;

      const newChat = await createPrivateChat(myId, targetId);
      if (!newChat?.id) return;

      const chat = useChatStore.getState().chats.find(c => c.participantId === targetId);
      const chatId = chat?.id || newChat.id;

      selectChat(chatId);

      if (socket) {
        socket.emit('join_chat', chatId);
      }

      // 🔥 Генерируем tempId
      const tempId = Date.now().toString();

      // 🔥 Отправляем tempId на сервер
      socket?.emit('send_message', {
        chatId,
        content,
        replyToId: replyToId || null,
        tempId, // ← ВАЖНО: передаём
      });

      // 🔥 Добавляем временно с тем же id
      addMessage({
        content,
        chatId,
        replyToId: replyToId || null,
        id: tempId,
        sender: '',
        timestamp: '',
        isOwn: false,
        userId: 0
      });

      setTempTargetUser(null);
      setReplyTo(null);
      setReplyToId(null);
    } catch (error) {
      console.error('Ошибка:', error);
    }
    return;
  }

  // Обычная отправка
  if (selectedChatId && selectedChatId > 0) {
    const tempId = Date.now().toString();

    socket?.emit('send_message', {
      chatId: selectedChatId,
      content,
      replyToId: replyToId || null,
      tempId, // ← передаём
    });

addMessage({
  id: tempId,
  content,
  chatId: selectedChatId, // или chatId — зависит от контекста
  replyToId: replyToId || null,
  sender: '',
  timestamp: '',
  isOwn: false,
  userId: 0
});

    setReplyTo(null);
    setReplyToId(null);
  }
}, [
  selectedChatId,
  user,
  addMessage,
  replyToId,
  setReplyTo,
  setReplyToId,
  tempTargetUserId,
  createPrivateChat,
  selectChat,
  setTempTargetUser,
]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (!isInitialized || isLoading) {
    return (
      <FlexContainer>
        <Preloader />
      </FlexContainer>
    );
  }

  return (
    <FlexContainer>
      <Sidebar>
        <UserMiniAvatar />
        {/* <ChatListTemp /> */}
        <ChatSidebar />
      </Sidebar>
      {isOpen && <Setting />}

      {selectedChatId ? (
        <ChatContainer>
          <MessageList
            ref={messageListRef}
            key={selectedChatId}
            role="log"
            aria-live="polite"
          >
            {isLoadingMessages ? (
              <PlugNoMessage>
                <Preloader />
              </PlugNoMessage>
            ) : messages.filter((msg) => msg.chatId === selectedChatId).length > 0 ? (
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
                <span>Здесь пока нет сообщений</span>
              </PlugNoMessage>
            )}
          </MessageList>

          {showScrollDown && (
            <ScrollToBottomButton
              $visible={showScrollDown}
              $replyActive={!!replyTo}
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
          <span>🤫 Welcome to private messenger 🤐</span>
        </PlugSelectChat>
      )}
    </FlexContainer>
  );
};

export default ChatPage;