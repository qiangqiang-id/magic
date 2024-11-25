import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createContainerById,
  removeContainerById,
  render,
} from '@/utils/portalRender';
import ContextMenuContent from './ContextMenuContent';

export interface MenuItem {
  label: string;
  onClick?: () => void;
  shortcut?: string;
  disabled?: boolean;
  children?: MenuItem[];
}

interface ContextMenuProps {
  items: MenuItem[];
}
export default function ContextMenu({ items }: ContextMenuProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleContextMenu]);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const newPosition = { ...position };

      if (rect.right > window.innerWidth) {
        newPosition.x = window.innerWidth - rect.width;
      }
      if (rect.bottom > window.innerHeight) {
        newPosition.y = window.innerHeight - rect.height;
      }

      if (newPosition.x < 0) newPosition.x = 0;
      if (newPosition.y < 0) newPosition.y = 0;

      if (newPosition.x !== position.x || newPosition.y !== position.y) {
        setPosition(newPosition);
      }
    }
  }, [position]);

  return (
    <div
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        backgroundColor: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        borderRadius: '4px',
        padding: '8px 0',
        zIndex: 1000,
      }}
    >
      <div ref={menuRef}>
        <ContextMenuContent items={items} depth={0} />
      </div>
    </div>
  );
}

const CONTEXT_MENU_ID = 'magic-context-menu';

ContextMenu.show = function show(props: ContextMenuProps) {
  const container = createContainerById(CONTEXT_MENU_ID);
  const content = <ContextMenu {...props} />;
  render(content, container);
};

ContextMenu.hide = function hide() {
  removeContainerById(CONTEXT_MENU_ID);
};
