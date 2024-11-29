import { Fragment } from 'react';
import MenuItemComponent from './MenuItemComponent';
import { MenuItem } from './props';
import Style from './ContextMenu.module.less';

interface ContextMenuContentProps {
  items: MenuItem[];
  onClose: () => void;
}

export default function ContextMenuContent(props: ContextMenuContentProps) {
  const { items, onClose } = props;

  return (
    <>
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {item.label === '-' ? (
            <div className={Style.divider} />
          ) : (
            <MenuItemComponent item={item} onClose={onClose} />
          )}
        </Fragment>
      ))}
    </>
  );
}
