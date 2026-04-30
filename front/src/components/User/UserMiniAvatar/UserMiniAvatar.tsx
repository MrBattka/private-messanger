import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../../../common/profile.png';
import { useAuthStore } from '../../../store/AuthStore';
import { Avatar, DropdownItem, DropdownMenu, Label, UserMiniAvatarContainer, UserName } from './UserMiniAvatar.styles';
import label from '../../../common/label1.jpeg';
import { useAvatarUpload } from '../../../hooks/useAvatarUpload';
import { useClickOutside } from '../../../hooks/useClickOutside';
import Setting from '../../Setting/Setting';
import { useSettingStore } from '../../../store/SettingStore';

const UserMiniAvatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dropdownRef = useClickOutside<HTMLDivElement>(
    isDropdownOpen,
    () => setIsDropdownOpen(false),
    [fileInputRef as React.RefObject<HTMLElement>]
  );

  const { logout, user, setUser } = useAuthStore();
  const { toggle } = useSettingStore()

  const navigate = useNavigate();

  const { avatarUrl, handleFileChange, changeAvatar } = useAvatarUpload(
    user?.avatarUrl,
    (newUrl) => setUser({ ...user!, avatarUrl: newUrl })
  );

  useEffect(() => {
    if (user && avatarUrl && avatarUrl !== user.avatarUrl) {
      setUser({ ...user, avatarUrl });
    }
  }, [avatarUrl, user, setUser]);

  useEffect(() => {
    return () => {
      if (avatarUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenSetting = () => {
    toggle()
    setIsDropdownOpen((prev) => !prev)
  }

  return (
    <UserMiniAvatarContainer ref={dropdownRef}>
      <Avatar
        src={avatarUrl || profile}
        alt="Аватар"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        $isOpen={isDropdownOpen}
      />
      <Label src={label} />
      {isDropdownOpen && (
        <DropdownMenu>
          <DropdownItem onClick={() => changeAvatar(fileInputRef)}>🧝🏽 Сменить аватар</DropdownItem>
          <DropdownItem onClick={handleOpenSetting}>⚙️ Настройки</DropdownItem>
          <DropdownItem onClick={handleLogout} style={{ color: 'red' }}>
            ➜] Выйти
          </DropdownItem>
        </DropdownMenu>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <UserName>{user?.username}</UserName>
    </UserMiniAvatarContainer>
  );
};

export default UserMiniAvatar;