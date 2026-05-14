import { useState } from "react";

export const useAvatarUpload = (
  initialAvatarUrl?: string | null,
  onChange?: (url: string) => void
) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      onChange?.(result);
    };
    reader.readAsDataURL(file);
  };

  const resetAvatar = () => setAvatarUrl(null);

  // Обновляем тип: принимаем RefObject<HTMLInputElement | null>
  const changeAvatar = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    inputRef.current?.click(); // безопасный вызов через ?.
  };

  return {
    avatarUrl,
    handleFileChange,
    changeAvatar,
    resetAvatar,
  };
};