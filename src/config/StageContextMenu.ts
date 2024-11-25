import { ContextMenuProps } from '@/components/ContextMenu';
import { Stores } from '@/store';

const menuItems = [
  {
    id: '1',
    label: 'New File',
    shortcut: '⌘N',
    onClick: () => console.log('New File clicked'),
  },
  {
    id: '2',
    label: 'Open',
    shortcut: '⌘O',
    submenu: [
      {
        id: '2-1',
        label: 'Recent Files',
        submenu: [
          {
            id: '2-1-1',
            label: 'Document 1.txt',
            onClick: () => console.log('Document 1 clicked'),
          },
          {
            id: '2-1-2',
            label: 'Document 2.txt',
            onClick: () => console.log('Document 2 clicked'),
          },
        ],
      },
      {
        id: '2-2',
        label: 'Browse...',
        onClick: () => console.log('Browse clicked'),
      },
    ],
  },
  {
    id: '3',
    divider: true,
  },
  {
    id: '4',
    label: 'Save',
    shortcut: '⌘S',
    onClick: () => console.log('Save clicked'),
  },
  {
    id: '5',
    label: 'Save As...',
    shortcut: '⌘⇧S',
    disabled: true,
  },
  {
    id: '6',
    divider: true,
  },
  {
    id: '7',
    label: 'Exit',
    onClick: () => console.log('Exit clicked'),
  },
];

export function getStageContextMenuProps(
  store: Stores,
  e: MouseEvent
): ContextMenuProps {
  // const { magic } = store;

  return {
    items: menuItems,
    x: e.pageX,
    y: e.pageY,
    // style: { width: 180, left: e.pageX, top: e.pageY },
    // onChange: () => {
    //   console.log('触发');
    // },
  };
}
