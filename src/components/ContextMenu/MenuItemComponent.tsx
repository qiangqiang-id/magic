import { useCallback, useRef, useState } from 'react';
import { MenuItem } from './ContextMenu';
import SubMenu from './SubMenu';

export default function MenuItemComponent({
  item,
  depth,
}: {
  item: MenuItem;
  depth: number;
}) {
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

  return (
    <div
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: '8px 16px',
        cursor: item.disabled ? 'default' : 'pointer',
        opacity: item.disabled ? 0.5 : 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onClick={() => !item.disabled && item.onClick && item.onClick()}
    >
      <span>{item.label}</span>
      {item.shortcut && (
        <span style={{ marginLeft: '20px', fontSize: '0.8em', color: '#666' }}>
          {item.shortcut}
        </span>
      )}
      {item.children && (
        <>
          <span style={{ marginLeft: '10px' }}>▶</span>
          {isSubMenuOpen && (
            <SubMenu
              items={item.children}
              depth={depth + 1}
              parentRef={itemRef}
            />
          )}
        </>
      )}
    </div>
  );
}
