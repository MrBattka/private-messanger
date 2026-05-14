import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSettingStore } from '../../store/SettingStore';
import {
  Close,
  FlexSettingContainer,
  ItemSetting,
  ManagingSettingContainer,
  SettingContainer,
  SettingListContainer,
  Stick,
  Title,
} from './Setting.styles';
import ThemeItem from './SettingItem/ThemeItem';
import NotifyItem from './SettingItem/NotifyItem';

// Список доступных разделов
type SettingSection = 'main' | 'theme' | 'notifications'; // можно расширять: 'language', 'notifications'...

const Setting = () => {
  const { isOpen, close } = useSettingStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<SettingSection>('theme');

  // Эффект для клика вне окна
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <SettingContainer ref={modalRef}>
      <Title>
        Настройки
      </Title>

      <FlexSettingContainer>
        <SettingListContainer>
            <ItemSetting 
              $activeSection={activeSection} 
              onClick={() => setActiveSection('theme')}
              $section="theme"
              >
                Тема
            </ItemSetting>
            <ItemSetting 
              $activeSection={activeSection} 
              onClick={() => setActiveSection('main')}
              $section="main"
              >
                Язык
            </ItemSetting>
            <ItemSetting 
              $activeSection={activeSection} 
              onClick={() => setActiveSection('notifications')}
              $section="notifications"
              >
                Уведомления
            </ItemSetting>
        </SettingListContainer>
        <Stick />

        <ManagingSettingContainer>
          {activeSection === 'theme' && <ThemeItem key="theme" />}
          {activeSection === 'notifications' && <NotifyItem key="notifications" />}
        </ManagingSettingContainer>
      </FlexSettingContainer>

      <Close onClick={close}>✗</Close>
    </SettingContainer>,
    modalRoot
  );
};

export default Setting;