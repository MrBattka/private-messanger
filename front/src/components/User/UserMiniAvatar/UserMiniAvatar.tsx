import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../../../common/profile.png';
import { useAuthStore } from '../../../store/AuthStore';
import { Avatar, DropdownItem, DropdownMenu, Label, UserMiniAvatarContainer, UserName } from './UserMiniAvatar.styles';
import icon from '../../../common/icon.png'

const UserMiniAvatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ссылка на весь компонент

  const { logout, user, setUser } = useAuthStore(); // Добавил setUser
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      const avatarUrl = user?.avatarUrl;
      if (avatarUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [user?.avatarUrl]);

  // Закрытие меню при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const changeAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Обновляем аватар локально
        setUser({ ...user, avatarUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Убрал openSettings, так как placeholder

  const avatarUrl = user?.avatarUrl || profile;

  return (
    <UserMiniAvatarContainer ref={dropdownRef}>
      <Avatar
        src={avatarUrl}
        alt="Аватар"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        $isOpen={isDropdownOpen}
      />
      <Label src={icon} />
      {isDropdownOpen && (
        <DropdownMenu>
          <DropdownItem onClick={changeAvatar}>Сменить аватар</DropdownItem>
          {/* <DropdownItem onClick={openSettings}>Настройки</DropdownItem> */} {/* Убрано */}
          <DropdownItem onClick={handleLogout} style={{ color: 'red' }}>
            Выйти
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