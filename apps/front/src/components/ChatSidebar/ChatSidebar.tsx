import { useState } from 'react';
import ChatListTemp from '../ChatListTemp/ChatListTemp';
import UserList from '../UserList/UserList';
import { SidebarTab, TabsContainer, TabButton } from './ChatSidebar.styles';
import { UnreadTotal } from '../ChatListTemp/ChatListTemp.styles';
import { useChatStore } from '../../store/chatStore';

const ChatSidebar = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'users'>('chats');
  const { chats } = useChatStore();
  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <SidebarTab>
      {/* Вкладки — фиксированная высота */}
      <TabsContainer>
        <TabButton $active={activeTab === 'chats'} onClick={() => setActiveTab('chats')}>
          Чаты
          {totalUnread > 0 && <UnreadTotal>{totalUnread}</UnreadTotal>}
        </TabButton>
        <TabButton $active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          Люди
        </TabButton>
      </TabsContainer>

      {/* Контент вкладки — занимает всё оставшееся пространство и скроллится */}
      <div style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
        {activeTab === 'chats' ? <ChatListTemp /> : <UserList />}
      </div>
    </SidebarTab>
  );
};

export default ChatSidebar;