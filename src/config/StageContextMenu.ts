import { ContextMenuProps } from '@/components/ContextMenu';
import { MenuItem } from '@/components/ContextMenu/props';

import { Stores } from '@/store';

const menuItems: MenuItem[] = [
  {
    label: '复制',
  },
  {
    label: '粘贴',
  },
  {
    label: '剪切',
  },

  { label: '-' },
  {
    label: '图层顺序',
  },
  {
    label: '图层位置',
  },
  {
    label: '选择重叠的图层',
  },
  { label: '-' },
  {
    label: '删除',
  },
  {
    label: '锁定',
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
  };
}
