import React from 'react';
import MenuItemComponent from './MenuItemComponent';

export interface MenuItem {
  label: string;
  onClick?: () => void;
  shortcut?: string;
  disabled?: boolean;
  children?: MenuItem[];
}

export default function ContextMenuContent({
  items,
  depth,
}: {
  items: MenuItem[];
  depth: number;
}) {
  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.label === '-' ? (
            <hr
              style={{
                margin: '8px 0',
                border: 'none',
                borderTop: '1px solid #ccc',
              }}
            />
          ) : (
            <MenuItemComponent item={item} depth={depth} />
          )}
        </React.Fragment>
      ))}
    </>
  );
}
