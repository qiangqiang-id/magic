import { useEffect, useRef, useState } from 'react';
import {
  createContainerById,
  removeContainerById,
  render,
} from '@/utils/portalRender';
import { useEscapeClose, useGlobalClick } from '@/hooks';
import ContextMenuContent from './ContextMenuContent';
import Style from './ContextMenu.module.less';
import { MenuItem } from './props';

export interface ContextMenuProps {
  items: MenuItem[];
  x: number;
  y: number;
}

export default function ContextMenu(props: ContextMenuProps) {
  const { items, x, y } = props;

  const [position, setPosition] = useState({ x, y });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    ContextMenu.hide();
  };

  useEscapeClose(handleClose, true, true);
  useGlobalClick(handleClose, true, menuRef);

  const getPosition = () => {
    if (menuRef.current) {
      /** 边界处理 */
      const rect = menuRef.current.getBoundingClientRect();
      const newPosition = { x, y };

      if (rect.right > window.innerWidth) {
        newPosition.x = window.innerWidth - rect.width;
      }
      if (rect.bottom > window.innerHeight) {
        newPosition.y = window.innerHeight - rect.height;
      }
      newPosition.x = Math.max(0, newPosition.x);
      newPosition.y = Math.max(0, newPosition.y);
      setPosition(newPosition);
    }
  };

  useEffect(() => {
    getPosition();
  }, [x, y]);

  return (
    <div
      className={Style.menu}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div ref={menuRef}>
        <ContextMenuContent items={items} onClose={handleClose} />
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
