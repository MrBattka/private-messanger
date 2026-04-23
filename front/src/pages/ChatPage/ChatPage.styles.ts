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
  width: 280px;
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
  overflow: hidden;
`;

export const MessageList = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(to bottom, #f8f9ff 0%, #f0f2ff 100%);
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
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
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;