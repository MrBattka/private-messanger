import styled from 'styled-components';

interface MessageContainerProps {
  isOwn: boolean;
}

export const MessageContainer = styled.div<MessageContainerProps>`
  position: relative; /* ← КЛЮЧЕВОЙ СТИЛЬ для абсолютного позиционирования ArrowIcon */
  max-width: 70%;
  margin: 8px 0;
  padding: 10px 32px 10px 15px;
  border-radius: 18px;
  background-color: ${props => props.isOwn ? '#007bff' : '#f1f1f1'};
  color: ${props => props.isOwn ? 'white' : 'black'};
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  text-align: left;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  user-select: none;

  &:hover {
    /* Добавим hover-эффект для контейнера, чтобы показать стрелочку */
  }
`;

export const MessageText = styled.p`
  margin: 0;
  word-wrap: break-word;
`;

export const MessageMeta = styled.small`
  display: block;
  margin-top: 5px;
  opacity: 0.7;
  font-size: 0.8em;
`;

/* Стили для цитирования (ответ на сообщение) */
export const ReplyBlock = styled.div<{ isOwn: boolean }>`
  padding: 6px 10px;
  margin-bottom: 8px;
  border-left: 3px solid ${props => (props.isOwn ? '#0056b3' : '#adb5bd')};
  background-color: ${props => (props.isOwn ? 'rgba(0, 123, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')};
  border-radius: 0 8px 8px 0;
  font-size: 0.9em;
  color: #495057;
  max-width: 100%;
  overflow: hidden;
  z-index: 10;
`;

export const ReplySender = styled.div`
  font-weight: 600;
  font-size: 0.85em;
  color: #333;
  margin-bottom: 2px;
`;

export const ReplyText = styled.div`
  font-size: 0.85em;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
`;

export const ArrowIcon = styled.span`
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 18px;
  color: #007bff;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 2;
  background-color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

  ${MessageContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.1);
    color: #0056b3;
  }
`;

// Выпадающее меню
export const ContextMenu = styled.div<{ x: number; y: number }>`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 10000;
  min-width: 120px;
  font-size: 0.9em;
`;

export const ContextMenuItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
  }
`;