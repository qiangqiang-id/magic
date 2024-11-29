import { useCallback, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import cls from 'classnames';
import SubMenu from './SubMenu';
import { MenuItem } from './props';
import Style from './ContextMenu.module.less';

interface MenuItemComponentProps {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemComponent(props: MenuItemComponentProps) {
  const { item, onClose } = props;

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (item.children) {
      setIsSubMenuOpen(true);
    }
  }, [item.children]);

  const handleMouseLeave = useCallback(() => {
    if (item.children) {
      setIsSubMenuOpen(false);
    }
  }, [item.children]);

  const handleClick = () => {
    if (item.disabled || item.children) return;
    item.onClick?.();
    onClose?.();
  };

  return (
    <div
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cls(Style['menu-item'], {
        [Style['menu-item-disabled']]: item.disabled,
        [Style['menu-item-active']]: isSubMenuOpen,
      })}
      onClick={handleClick}
    >
      <div className={Style['menu-item-info']}>
        {item.icon}
        <span className={Style['menu-item-label']}>{item.label}</span>
      </div>

      {item.shortcut && (
        <span className={Style['menu-item-shortcut']}>{item.shortcut}</span>
      )}
      {item.children && (
        <>
          <span style={{ marginLeft: '10px' }}>
            <ChevronRight />
          </span>
          {isSubMenuOpen && (
            <SubMenu
              items={item.children}
              parentRef={itemRef}
              onClose={onClose}
            />
          )}
        </>
      )}
    </div>
  );
}
