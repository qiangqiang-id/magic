import { useEffect, useRef } from 'react';
import { MenuItem } from './ContextMenu';
import ContextMenuContent from './ContextMenuContent';

export default function SubMenu({
  items,
  depth,
  parentRef,
}: {
  items: MenuItem[];
  depth: number;
  parentRef: React.RefObject<HTMLDivElement>;
}) {
  const subMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

      subMenuRef.current.style.left = left;
      subMenuRef.current.style.top = top;
    }
  }, [parentRef]);

  return (
    <div
      ref={subMenuRef}
      style={{
        position: 'absolute',
        backgroundColor: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        borderRadius: '4px',
        padding: '8px 0',
        zIndex: 1001,
      }}
    >
      <ContextMenuContent items={items} depth={depth} />
    </div>
  );
}
