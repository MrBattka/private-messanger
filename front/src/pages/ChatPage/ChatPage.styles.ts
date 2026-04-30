import styled from 'styled-components';
import Button from '../../components/Button/Button';

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`;

export const Sidebar = styled.div`
  width: 270px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  overflow-y: auto;
  transition: width 0.3s ease;
`;

export const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(10px);
  position: relative; /* для абсолютной кнопки */
  min-height: 0;
`;

export const MessageList = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(to bottom, #f8f9ff 0%, #f0f2ff 100%);
  min-height: 0;
  scroll-behavior: auto;
`;

export const SendButton = styled(Button)`
  margin-left: 10px;
  width: 10px;
  border-radius: 25px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
`;

export const ButtonLogout = styled(Button)`
  width: 100%;
  padding: 10px;
  background-color: '#e74c3c';
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
`;

export const PlugSelectChat = styled.p`
  flex: 1;
  margin: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  background: linear-gradient(135deg, rgb(255, 255, 255) 0%, #e4d3f8 100%);
  font-size: 24px;
  letter-spacing: 1px;
  color: #7a6a8b;
`;

export const PlugNoMessage = styled.div`
  flex: 1;
  margin: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  font-size: 20px;
  letter-spacing: 1px;
  color: #7a6a8b;
`;


interface ScrollToBottomButtonProps {
  $visible: boolean;
  $replyActive?: boolean; // ← новое свойство
}

export const ScrollToBottomButton = styled.button<ScrollToBottomButtonProps>`
  position: absolute;
  bottom: ${({ $replyActive }) => ($replyActive ? '130px' : '80px')}; /* ↑ поднимаем при активной цитате */
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(100, 100, 200, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  transition: opacity 0.3s ease;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
`;