import { MouseEvent } from 'react';
import { ChevronRight } from 'lucide-react';
import cls from 'classnames';
import Style from './MenuItem.module.less';
import { MenuItemType } from '../props';

interface MenuItemProps {
  item: MenuItemType;
  onMouseEnter: (item: MenuItemType, event: MouseEvent) => void;
  onMouseLeave: (event: MouseEvent) => void;
  onClose: () => void;
}

export default function MenuItem(props: MenuItemProps) {
  const { item, onMouseEnter, onMouseLeave, onClose } = props;

  if (item.divider) {
    return <div className="h-px bg-gray-200 my-1" />;
  }

  return (
    <div
      className={cls(Style.menuItem, item.disabled && Style.disabled)}
      onClick={() => {
        if (!item.disabled && item.onClick) {
          item.onClick();
          onClose();
        }
      }}
      onMouseEnter={e => onMouseEnter(item, e)}
      onMouseLeave={onMouseLeave}
      // role="menuitem"
      aria-disabled={item.disabled}
      aria-haspopup={!!item.submenu}
    >
      <span>{item.label}</span>
      <div className="flex items-center gap-2">
        {item.shortcut && (
          <span className="text-xs text-gray-400 ml-4 font-mono">
            {item.shortcut}
          </span>
        )}
        {item.submenu && <ChevronRight className="w-4 h-4 text-gray-400" />}
      </div>
    </div>
  );
}
