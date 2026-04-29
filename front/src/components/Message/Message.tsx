import React, { useState, useRef, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import {
  MessageContainer,
  MessageText,
  MessageMeta,
  ReplyBlock,
  ReplyText,
  ReplySender,
  ArrowIcon,
  ContextMenu,
  ContextMenuItem,
} from './Message.styles';

interface ReplyTo {
  sender: string;
  content: string;
}

export interface MessageProps {
  content: string;
  sender: string;
  timestamp: string;
  isOwn?: boolean;
  replyTo?: ReplyTo | null;
  replyToId?: number | string | null;
  onReply?: () => void;
  style?: React.CSSProperties;
  messageId: string;
  onQuoteClick?: (quotedMessageId: string) => void;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      content,
      sender,
      timestamp,
      isOwn = false,
      replyTo,
      onReply,
      style,
      messageId,
      replyToId,
      onQuoteClick,
    },
    ref
  ) => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const handleArrowClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setMenuPosition({ x: rect.left, y: rect.bottom });
      setShowMenu(true);
    };

    const closeMenu = () => {
      setShowMenu(false);
    };

    const handleReplySelect = () => {
      onReply?.();
      closeMenu();
    };

  const handleQuoteClick = () => {
    console.log('Клик по цитате:', { replyTo, replyToId, onQuoteClick })
    if (replyTo && onQuoteClick && replyToId != null) {
      onQuoteClick(String(replyToId));
    }
  };

    return (
      <MessageContainer
        ref={ref} // присваиваем ref
        isOwn={isOwn}
        onDoubleClick={(e) => {
          e.preventDefault();
          onReply?.();
        }}
        style={style}
        onClick={closeMenu}
      >
        <ArrowIcon onClick={handleArrowClick}>→</ArrowIcon>

        {replyTo && (
          <ReplyBlock isOwn={isOwn} onClick={handleQuoteClick} style={{ cursor: 'pointer' }}>
            <ReplySender>→ {replyTo.sender}</ReplySender>
            <ReplyText>{replyTo.content}</ReplyText>
          </ReplyBlock>
        )}

        <MessageText>{content}</MessageText>

        <MessageMeta>
          {sender}, {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </MessageMeta>

        {showMenu &&
          createPortal(
            <ContextMenu x={menuPosition.x} y={menuPosition.y} onClick={(e) => e.stopPropagation()}>
              <ContextMenuItem onClick={handleReplySelect}>Ответить</ContextMenuItem>
            </ContextMenu>,
            document.body
          )}
      </MessageContainer>
    );
  }
);

export default Message;