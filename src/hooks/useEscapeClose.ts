import { useEffect } from 'react';
import KeyCodeMap from '@/constants/KeyCode';

/**
 * 是否启用ESC键hooks
 * @param handler 执行钩子
 * @param effective 是否真实有效的交互
 */
export default function useEscapeClose(
  close: () => void,
  escapeClosable: boolean,
  visibility: boolean
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyCode = e.keyCode || e.which;
      if (keyCode === KeyCodeMap.ESC) close();
    };

    if (escapeClosable && visibility) {
      document.addEventListener('keydown', handleKeyDown, false);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [escapeClosable, visibility]);
}
