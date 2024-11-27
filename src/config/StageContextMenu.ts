import { ContextMenuProps } from '@/components/ContextMenu';
import { MenuItem } from '@/components/ContextMenu/ContextMenuContent';
import { Stores } from '@/store';

const menuItems: MenuItem[] = [
  {
    label: 'File',
    children: [
      {
        label: 'New',
        onClick: () => console.log('New file'),
        shortcut: 'Ctrl+N',
      },
      {
        label: 'Open',
        onClick: () => console.log('Open file'),
        shortcut: 'Ctrl+O',
      },
      {
        label: 'Save',
        onClick: () => console.log('Save file'),
        shortcut: 'Ctrl+S',
      },
      { label: '-' },
      { label: 'Exit', onClick: () => console.log('Exit'), shortcut: 'Alt+F4' },
    ],
  },
  {
    label: 'Edit',
    children: [
      { label: 'Undo', onClick: () => console.log('Undo'), shortcut: 'Ctrl+Z' },
      { label: 'Redo', onClick: () => console.log('Redo'), shortcut: 'Ctrl+Y' },
      { label: '-' },
      { label: 'Cut', onClick: () => console.log('Cut'), shortcut: 'Ctrl+X' },
      { label: 'Copy', onClick: () => console.log('Copy'), shortcut: 'Ctrl+C' },
      {
        label: 'Paste',
        // onClick: () => console.log('Paste'),
        shortcut: 'Ctrl+V',
        children: [
          {
            label: 'Reset Zoom1',
            onClick: () => console.log('Reset zoom1'),
            shortcut: 'Ctrl+0',
          },
        ],
      },
    ],
  },
  {
    label: 'View',
    children: [
      {
        label: 'Zoom In',
        onClick: () => console.log('Zoom in'),
        shortcut: 'Ctrl++',
      },
      {
        label: 'Zoom Out',
        onClick: () => console.log('Zoom out'),
        shortcut: 'Ctrl+-',
      },
      {
        label: 'Reset Zoom',
        onClick: () => console.log('Reset zoom'),
        shortcut: 'Ctrl+0',
      },
    ],
  },
  { label: '-' },
  { label: 'Help', onClick: () => console.log('Help') },
  { label: 'About', onClick: () => console.log('About'), disabled: true },
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
  };
}
