import React from 'react';
import { useSettingStore } from '../../../store/SettingStore';
import { Toggle, ThemeLabel, ThemeItemContainer } from './ThemeItem.styles';

const NotifyItem = () => {
  const { isSoundEnabled, toggleSound } = useSettingStore();

  return (
    <ThemeItemContainer>
      <ThemeLabel>
        Уведомления
        <Toggle checked={isSoundEnabled === true} onChange={toggleSound} type="checkbox" />
      </ThemeLabel>
    </ThemeItemContainer>
  );
};

export default NotifyItem;