import {
  Copy,
  ClipboardPaste,
  Scissors,
  Layers,
  Blend,
  LockKeyhole,
  LockKeyholeOpen,
  Trash2,
  BookUp,
  FoldVertical,
  FoldHorizontal,
  SquareSquare,
  ArrowDownToLine,
  ArrowUpToLine,
  ArrowLeftToLine,
  ArrowRightToLine,
} from 'lucide-react';
import { ContextMenuProps } from '@/components/ContextMenu';
import { MenuItem } from '@/components/ContextMenu/props';
import CmdManager from '@/core/Manager/Cmd';
import { Stores } from '@/store';
import { getHotKeyByCmd, getHotKeyCmdOfOS } from '@/helpers/HotKey';
import CmdEnum from '@/constants/CmdEnum';
import { HotKey } from './HotKeys';
import { LayerStrucType } from '@/types/model';

/**
 * 复制
 */
const copyHotKey = getHotKeyByCmd(CmdEnum.COPY);

/**
 * 剪切
 */
const cutHotKey = getHotKeyByCmd(CmdEnum.CUT);

/**
 * 粘贴
 */
const pasteHotKey = getHotKeyByCmd(CmdEnum.PASTE);

/**
 * 删除
 */
const deleteHotKey = getHotKeyByCmd(CmdEnum.DELETE);

/**
 * 执行快捷键命令
 */
const pressHotKey = (hotKey?: HotKey) => {
  hotKey?.name && CmdManager.execute(hotKey.name);
};

function getBaseMenuItems(): MenuItem[] {
  return [
    {
      label: copyHotKey?.label || '',
      icon: <Copy width={20} height={20} />,
      shortcut: getHotKeyCmdOfOS(copyHotKey),
      onClick: () => pressHotKey(copyHotKey),
    },
    {
      label: pasteHotKey?.label || '',
      icon: <ClipboardPaste width={20} height={20} />,
      shortcut: getHotKeyCmdOfOS(pasteHotKey),
      onClick: () => pressHotKey(pasteHotKey),
    },
    {
      label: cutHotKey?.label || '',
      icon: <Scissors width={20} height={20} />,
      shortcut: getHotKeyCmdOfOS(cutHotKey),
      onClick: () => pressHotKey(cutHotKey),
    },
  ];
}

function getLayerOrderMenuItems(model?: LayerStrucType): MenuItem[] {
  return [
    {
      label: '图层顺序',
      icon: <Layers width={20} height={20} />,
      children: [
        {
          label: '移到顶层',
          onClick: () => model?.toTop(),
        },
        {
          label: '上移一层',
          onClick: () => model?.toUp(),
        },
        {
          label: '下移一层',
          onClick: () => model?.toDown(),
        },
        {
          label: '置于底层',
          onClick: () => model?.toBottom(),
        },
      ],
    },
  ];
}

function getLayerPositionMenuItems(model?: LayerStrucType): MenuItem[] {
  return [
    {
      label: '图层位置',
      icon: <BookUp width={20} height={20} />,
      children: [
        {
          label: '水平居中',
          icon: <FoldHorizontal width={20} height={20} />,
          onClick: () => model?.toHorizontalCenterAlignInCanvas(),
        },
        {
          label: '垂直居中',
          icon: <FoldVertical width={20} height={20} />,
          onClick: () => model?.toVerticalCenterAlignInCanvas(),
        },
        {
          label: '贴顶部',
          icon: <ArrowUpToLine width={20} height={20} />,
          onClick: () => model?.toTopInCanvas(),
        },
        {
          label: '贴底部',
          icon: <ArrowDownToLine width={20} height={20} />,
          onClick: () => model?.toBottomInCanvas(),
        },
        {
          label: '画布中心',
          icon: <SquareSquare width={20} height={20} />,
          onClick: () => model?.toCenterAlignInCanvas(),
        },
        {
          label: '贴右侧',
          icon: <ArrowRightToLine width={20} height={20} />,
          onClick: () => model?.toRightInCanvas(),
        },
        {
          label: '贴左侧',
          icon: <ArrowLeftToLine width={20} height={20} />,
          onClick: () => model?.toLeftInCanvas(),
        },
      ],
    },
  ];
}

function getOverlapMenuItems(store: Stores): MenuItem[] {
  console.log('store', store);
  return [
    {
      label: '选择重叠的图层',
      icon: <Blend width={20} height={20} />,
      children: [
        {
          label: '相交',
        },
        {
          label: '并集',
        },
        {
          label: '差集',
        },
      ],
    },
  ];
}

function getBottomBaseMenuItems(model?: LayerStrucType): MenuItem[] {
  const handleLock = () => {
    model?.switchLock();
  };

  return [
    {
      label: deleteHotKey?.label || '',
      icon: <Trash2 width={20} height={20} />,
      shortcut: getHotKeyCmdOfOS(deleteHotKey),
      onClick: () => pressHotKey(deleteHotKey),
    },
    {
      label: model?.isLock ? '解锁' : '锁定',
      icon: model?.isLock ? (
        <LockKeyhole width={20} height={20} />
      ) : (
        <LockKeyholeOpen width={20} height={20} />
      ),
      onClick: handleLock,
    },
  ];
}

export function getStageContextMenuProps(
  store: Stores,
  e: MouseEvent
): ContextMenuProps {
  const x = e.pageX;
  const y = e.pageY;

  const { activedLayers } = store.magic;

  // todo 暂时默认第一个图层
  const model = activedLayers[0];

  const menuItems: MenuItem[] = [
    ...getBaseMenuItems(),
    { label: '-' },
    ...getLayerOrderMenuItems(model),
    ...getLayerPositionMenuItems(model),
    ...getOverlapMenuItems(store),
    { label: '-' },
    ...getBottomBaseMenuItems(model),
  ];

  return {
    items: menuItems,
    x,
    y,
  };
}
