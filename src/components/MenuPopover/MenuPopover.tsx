import { ReactNode, useState, useEffect, MouseEvent } from 'react';
import { Popover, PopoverProps } from 'antd';
import cls from 'classnames';

import Style from './MenuPopover.module.less';

interface Action<T = any> {
  status?: string | boolean;
  name: string;
  handle?: (data?: T) => void;
  icon?: ReactNode;
  disable?: boolean;
}

interface MenuPopoverProps<T = any>
  extends Omit<PopoverProps, 'title' | 'content'> {
  className?: string;
  children?: ReactNode;
  actionList: Action<T>[];
  itemClassName?: string;
}

export default function MenuPopover(props: MenuPopoverProps) {
  const {
    className,
    children,
    open = false,
    actionList,
    onOpenChange,
    overlayInnerStyle,
    itemClassName,
    ...otherProps
  } = props;

  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  const handleClickMenu = (e: MouseEvent, action: Action) => {
    if (action.disable) return;
    action.handle?.();
    setVisible(false);
    onOpenChange?.(false);
  };

  const openChange = (open: boolean) => {
    setVisible(open);
    onOpenChange?.(open);
  };

  /** popover 框内容渲染 */
  const renderContent = (
    <div className={Style.popover_content}>
      {actionList.map(action => (
        <div
          key={action.name}
          className={cls(Style.popover_item, itemClassName, {
            [Style.disable]: action.disable,
          })}
          onClick={e => {
            handleClickMenu(e, action);
          }}
        >
          {action.icon && (
            <div className={Style.popover_item_icon}>{action.icon}</div>
          )}
          {action.name}
        </div>
      ))}
    </div>
  );

  /** popover 的元素渲染 */
  const renderChildren = children || (
    <div className={cls(Style.menu, className)}>
      {Array.from({ length: 3 }, (_, index) => (
        <div className={Style.point} key={index} />
      ))}
    </div>
  );

  return (
    <Popover
      content={renderContent}
      open={visible}
      onOpenChange={openChange}
      overlayInnerStyle={{
        padding: 0,
        borderRadius: 4,
        ...overlayInnerStyle,
      }}
      mouseLeaveDelay={0.2}
      {...otherProps}
    >
      {renderChildren}
    </Popover>
  );
}
