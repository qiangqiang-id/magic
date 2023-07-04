import { useEffect } from 'react';
import hotKeyMaps, { HotKey } from '@/config/HotKeys';
import CmdEnum from '@/constants/CmdEnum';
import { atInput, getInputHotKeys } from '@/helpers/HotKey';
import CmdManager from './Cmd';

export default function KeyboardManager() {
  /**
   * 执行快捷键命令
   */
  const pressHotKey = (hotKey: HotKey) => {
    CmdManager.execute(hotKey.name);
  };

  /**
   * 处理键盘事件
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    const keyCode = e.keyCode || e.which;
    const { shiftKey, ctrlKey, altKey, metaKey } = e;

    // 兼容win和mac
    const ctrl = metaKey || ctrlKey;

    for (const keyBoard of hotKeyMaps) {
      // 键值未注册
      if (!keyBoard) continue;

      const code = keyBoard.keyCode;

      if (Array.isArray(code)) {
        if (!code.includes(keyCode)) continue;
      } else if (code !== keyCode) {
        continue;
      }

      if ((shiftKey && !keyBoard.shiftKey) || (keyBoard.shiftKey && !shiftKey))
        continue;

      if ((ctrl && !keyBoard.ctrlKey) || (keyBoard.ctrlKey && !ctrl)) continue;

      if ((altKey && !keyBoard.altKey) || (keyBoard.altKey && !altKey))
        continue;

      if (
        atInput(e.target as HTMLElement) &&
        getInputHotKeys().includes(keyBoard)
      )
        return;

      // 保留系统粘贴
      if (keyBoard.name !== CmdEnum.PASTE) e.preventDefault();

      pressHotKey(keyBoard);
      break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
