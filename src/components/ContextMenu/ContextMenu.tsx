import { useRef, useState, Fragment, MouseEvent } from 'react';
import cls from 'classnames';
import MenuItem from './MenuItem';
import { useMenuPosition, useGlobalClick, useEscapeClose } from '@/hooks';
import {
  createContainerById,
  removeContainerById,
  render,
} from '@/utils/portalRender';
import { ComponentProps } from '@/types/componentProps';

import Style from './ContextMenu.module.less';

import { MenuItemType } from './props';

export interface ContextMenuProps extends ComponentProps {
  items: MenuItemType[];
  x: number;
  y: number;
  isSubmenu?: boolean;
  parentRect?: DOMRect | null;
  escapeClosable?: boolean;
}

function ContextMenu(props: ContextMenuProps) {
  const {
    items,
    x: initialX,
    y: initialY,
    isSubmenu = false,
    parentRect = null,
    style,
    className,
    escapeClosable = true,
  } = props;

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    ContextMenu.hide();
  };

  const [activeSubmenu, setActiveSubmenu] = useState<{
    id: string;
    rect: DOMRect;
  } | null>(null);

  const position = useMenuPosition(
    menuRef,
    initialX,
    initialY,
    isSubmenu,
    parentRect
  );

  useGlobalClick(handleClose, true, menuRef);
  useEscapeClose(handleClose, escapeClosable, true);

  const handleSubmenuEnter = (item: MenuItemType, event: MouseEvent) => {
    if (item.submenu && !item.disabled) {
      const element = event.currentTarget as HTMLElement;
      const rect = element.getBoundingClientRect();
      setActiveSubmenu({
        id: item.id,
        rect,
      });
    }
  };

  const handleSubmenuLeave = (e: MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget?.closest('.context-submenu')) {
      setActiveSubmenu(null);
    }
  };

  return (
    <div
      ref={menuRef}
      className={cls(
        Style.menu,
        `${isSubmenu ? 'context-submenu' : ''}`,
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        transformOrigin: position.transformOrigin,
        ...style,
      }}
    >
      {items.map(item => (
        <Fragment key={item.id}>
          <MenuItem
            item={item}
            onMouseEnter={handleSubmenuEnter}
            onMouseLeave={handleSubmenuLeave}
            onClose={handleClose}
          />
          {activeSubmenu?.id === item.id && item.submenu && (
            <ContextMenu
              items={item.submenu}
              x={activeSubmenu.rect.right}
              y={activeSubmenu.rect.top}
              isSubmenu
              parentRect={activeSubmenu.rect}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default ContextMenu;

const CONTEXT_MENU_ID = 'magic-context-menu';

ContextMenu.show = function show(props: ContextMenuProps) {
  const container = createContainerById(CONTEXT_MENU_ID);
  const content = <ContextMenu {...props} />;
  render(content, container);
};

ContextMenu.hide = function hide() {
  removeContainerById(CONTEXT_MENU_ID);
};
