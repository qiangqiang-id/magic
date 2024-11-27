import { Fragment } from 'react';
import MenuItemComponent from './MenuItemComponent';
import { MenuItem } from './props';
import Style from './ContextMenu.module.less';

interface ContextMenuContentProps {
  items: MenuItem[];
}

export default function ContextMenuContent(props: ContextMenuContentProps) {
  const { items } = props;

  return (
    <>
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {item.label === '-' ? (
            <div className={Style.divider} />
          ) : (
            <MenuItemComponent item={item} />
          )}
        </Fragment>
      ))}
    </>
  );
}
