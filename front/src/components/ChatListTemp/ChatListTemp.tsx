import { useChatStore } from '../../store/chatStore';
import { Avatar, ChatInfo, ChatItem, ChatListContainer, ChatName, LastMessage, OnlineIndicator, Timestamp, Title, UnreadBadge } from './ChatListTemp.styles';

const ChatListTemp = () => {
  const { chats, selectedChatId, selectChat } = useChatStore();

  return (
    <ChatListContainer>
      <Title>Чаты</Title>
      {chats.map((chat) => (
        <ChatItem key={chat.id} $isSelected={selectedChatId === chat.id} onClick={() => selectChat(chat.id)}>
          <Avatar>
            {chat.name.charAt(0).toUpperCase()}
            {chat.isOnline && <OnlineIndicator />}
          </Avatar>
          <ChatInfo>
            <ChatName>{chat.name}</ChatName>
            <LastMessage>{chat.lastMessage}</LastMessage>
          </ChatInfo>
          <Timestamp>{chat.time}</Timestamp>
          {chat.unreadCount > 0 && <UnreadBadge>{chat.unreadCount}</UnreadBadge>}
        </ChatItem>
      ))}
    </ChatListContainer>
  );
};

export default ChatListTemp;