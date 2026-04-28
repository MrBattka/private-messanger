import { useEffect, useRef } from 'react';

export const useClickOutside = <T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
  ignoreRefs?: React.RefObject<HTMLElement>[]
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const path = event.composedPath();
      const isOutside = ref.current && !path.includes(ref.current);
      const isIgnored = ignoreRefs?.some(ignoreRef => 
        ignoreRef.current && path.includes(ignoreRef.current)
      );

      if (isOutside && !isIgnored) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, ignoreRefs]);

  return ref;
};