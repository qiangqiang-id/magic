import { RefObject, useEffect } from 'react';
import { Stores, useStores } from '@/store';
import { CANVAS_WRAPPER } from '@/constants/Refs';
import ContextMenu from '@/components/ContextMenu';
import { getStageContextMenuProps } from '@/config/StageContextMenu';
import { ContextMenuProps } from '@/components/ContextMenu/props';

type ContextSourceKeys = RefObject<HTMLElement>;
type ContextSourceValues = (store: Stores, e: MouseEvent) => ContextMenuProps;

const contextSourceMap = new Map<ContextSourceKeys, ContextSourceValues>();
contextSourceMap.set(CANVAS_WRAPPER, getStageContextMenuProps);

export default function ContextMenuManager() {
  const store = useStores();

  const handleContextMenu = (e: MouseEvent) => {
    const node = e.target as HTMLElement;

    let options: ContextMenuProps | undefined;

    for (const ref of contextSourceMap.keys()) {
      if (ref.current?.contains(node)) {
        e.preventDefault();
        options = contextSourceMap.get(ref)?.(store, e);
        break;
      }
    }

    options && ContextMenu.show(options);
  };

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu, false);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  });

  return null;
}
