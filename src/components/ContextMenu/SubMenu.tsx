import { useEffect, useRef, useState, RefObject } from 'react';
import ContextMenuContent from './ContextMenuContent';
import { MenuItem } from './props';
import Style from './ContextMenu.module.less';

interface SubMenuProps {
  items: MenuItem[];
  parentRef: RefObject<HTMLDivElement>;
}

export default function SubMenu(props: SubMenuProps) {
  const { items, parentRef } = props;

  const subMenuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: '100%', top: '0' });

  const getPosition = () => {
    if (subMenuRef.current && parentRef.current) {
      const subMenuRect = subMenuRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();

      let left = '100%';
      let top = '0';
      if (parentRect.right + subMenuRect.width > window.innerWidth) {
        left = `-${subMenuRect.width}px`;
      }
      if (parentRect.bottom + subMenuRect.height > window.innerHeight) {
        top = `${parentRect.height - subMenuRect.height}px`;
      }
      setPosition({ left, top });
    }
  };

  useEffect(() => {
    getPosition();
  }, []);

  return (
    <div
      ref={subMenuRef}
      className={Style['sub-menu']}
      style={{
        ...position,
      }}
    >
      <ContextMenuContent items={items} />
    </div>
  );
}
