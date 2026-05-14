import React from 'react';
import { useSettingStore } from '../../../store/SettingStore';
import { Toggle, ThemeLabel, ThemeItemContainer } from './ThemeItem.styles';

const ThemeItem = () => {
  const { theme, toggleTheme } = useSettingStore();

  return (
    <ThemeItemContainer>
      <ThemeLabel>
        Темная тема
        <Toggle checked={theme === 'dark'} onChange={toggleTheme} type="checkbox" />
      </ThemeLabel>
    </ThemeItemContainer>
  );
};

export default ThemeItem;