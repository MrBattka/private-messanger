import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/AuthStore';
import styled from 'styled-components';
import { ChatInfo, ChatItem, LastMessage } from '../ChatListTemp/ChatListTemp.styles';
import { Avatar, List, UserName } from './UserList.styles';

interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
}

const UserList = () => {
  const { users, chats, setTempTargetUser, selectChat, selectUser, selectedUserId } = useChatStore();
  const { user: currentUser } = useAuthStore();

  const handleUserClick = (targetUser: User) => {
    if (!currentUser?.id) return;

    selectUser(targetUser.id)
    setTempTargetUser(targetUser.id);

    const existingChat = chats.find(chat =>
      chat.participantId === targetUser.id
    );

    if (existingChat) {
      selectChat(existingChat.id);
    } else {
      selectChat(-1);
    }
  };

  return (
    <List>
      <h4>Пользователи</h4>
      {users.length === 0 ? (
        <p>Нет пользователей</p>
      ) : (
        users
          .filter(u => u.id !== currentUser?.id)
          .map(user => {
            const chatWithUser = chats.find(chat => chat.participantId === user.id);

            return (
              <ChatItem
                key={user.id}
                $isSelected={selectedUserId === user.id}
                onClick={() => handleUserClick(user)}
              >
                <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                <ChatInfo>
                  <UserName>{user.username}</UserName>
                  <LastMessage>
                    {chatWithUser ? chatWithUser.lastMessage : 'Новое сообщение'}
                  </LastMessage>
                </ChatInfo>
              </ChatItem>
            );
          })
      )}
    </List>
  );
};

export default UserList;