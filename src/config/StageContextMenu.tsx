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
  TypeOutline,
} from 'lucide-react';
import { Image } from 'antd';
import { ContextMenuProps } from '@/components/ContextMenu';
import { MenuItem } from '@/components/ContextMenu/props';
import CmdManager from '@/core/Manager/Cmd';
import { Stores } from '@/store';
import { getHotKeyByCmd, getHotKeyCmdOfOS } from '@/helpers/HotKey';
import CmdEnum from '@/constants/CmdEnum';
import { HotKey } from './HotKeys';
import { LayerStrucType } from '@/types/model';
import { toCanvasPoint } from '@/helpers/Node';
import { getLayersByPoint } from '@/utils/layers';
import { LayerTypeEnum } from '@/constants/LayerTypeEnum';

import Shape from '@/components/Renderer/Layer/Shape';

const SIZE = 20;

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
      icon: <Copy width={SIZE} height={SIZE} />,
      shortcut: getHotKeyCmdOfOS(copyHotKey),
      onClick: () => pressHotKey(copyHotKey),
    },
    {
      label: pasteHotKey?.label || '',
      icon: <ClipboardPaste width={SIZE} height={SIZE} />,
      shortcut: getHotKeyCmdOfOS(pasteHotKey),
      onClick: () => pressHotKey(pasteHotKey),
    },
    {
      label: cutHotKey?.label || '',
      icon: <Scissors width={SIZE} height={SIZE} />,
      shortcut: getHotKeyCmdOfOS(cutHotKey),
      onClick: () => pressHotKey(cutHotKey),
    },
  ];
}

function getLayerOrderMenuItems(model?: LayerStrucType): MenuItem[] {
  return [
    {
      label: '图层顺序',
      icon: <Layers width={SIZE} height={SIZE} />,
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
      icon: <BookUp width={SIZE} height={SIZE} />,
      children: [
        {
          label: '水平居中',
          icon: <FoldHorizontal width={SIZE} height={SIZE} />,
          onClick: () => model?.toHorizontalCenterAlignInCanvas(),
        },
        {
          label: '垂直居中',
          icon: <FoldVertical width={SIZE} height={SIZE} />,
          onClick: () => model?.toVerticalCenterAlignInCanvas(),
        },
        {
          label: '贴顶部',
          icon: <ArrowUpToLine width={SIZE} height={SIZE} />,
          onClick: () => model?.toTopInCanvas(),
        },
        {
          label: '贴底部',
          icon: <ArrowDownToLine width={SIZE} height={SIZE} />,
          onClick: () => model?.toBottomInCanvas(),
        },
        {
          label: '画布中心',
          icon: <SquareSquare width={SIZE} height={SIZE} />,
          onClick: () => model?.toCenterAlignInCanvas(),
        },
        {
          label: '贴右侧',
          icon: <ArrowRightToLine width={SIZE} height={SIZE} />,
          onClick: () => model?.toRightInCanvas(),
        },
        {
          label: '贴左侧',
          icon: <ArrowLeftToLine width={SIZE} height={SIZE} />,
          onClick: () => model?.toLeftInCanvas(),
        },
      ],
    },
  ];
}

function getLayerLabel(layer: LayerStrucType) {
  if (layer.isText()) {
    return layer.content || '文本';
  }

  switch (layer.type) {
    case LayerTypeEnum.GROUP:
      return '组';
    case LayerTypeEnum.IMAGE:
      return '图片';
    case LayerTypeEnum.SHAPE:
      return '形状';
    default:
      return layer.name || '未知';
  }
}
function getLayerIcon(layer: LayerStrucType) {
  if (layer.isImage()) {
    return <Image src={layer.url} width={SIZE} height={SIZE} preview={false} />;
  }

  if (layer.isShape()) {
    const { width, height } = layer.getSafetyModalData();
    const scale = Math.min(SIZE / width, SIZE / height);
    return (
      <div
        style={{
          width: SIZE,
          height: SIZE,
        }}
      >
        <div
          style={{
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          }}
        >
          <Shape model={layer} />
        </div>
      </div>
    );
  }

  if (layer.isText()) {
    return <TypeOutline width={SIZE} height={SIZE} />;
  }

  if (layer.isGroup()) {
    // todo
  }

  return <div>icon</div>;
}

function getOverlapMenuItems(store: Stores, point: Point): MenuItem[] {
  const { magic, OS } = store;

  const { activedScene } = magic;
  const { x, y } = toCanvasPoint(point);

  const layers = getLayersByPoint(activedScene?.layers || [], {
    x: x / OS.zoomLevel,
    y: y / OS.zoomLevel,
  });

  const children: MenuItem[] = layers.map(layer => ({
    icon: getLayerIcon(layer),
    label: getLayerLabel(layer),
    onClick: () => magic.activeLayer(layer),
  }));
  return [
    {
      label: '选择重叠的图层',
      icon: <Blend width={SIZE} height={SIZE} />,
      children,
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
      icon: <Trash2 width={SIZE} height={SIZE} />,
      shortcut: getHotKeyCmdOfOS(deleteHotKey),
      onClick: () => pressHotKey(deleteHotKey),
    },
    {
      label: model?.isLock ? '解锁' : '锁定',
      icon: model?.isLock ? (
        <LockKeyhole width={SIZE} height={SIZE} />
      ) : (
        <LockKeyholeOpen width={SIZE} height={SIZE} />
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
    ...getOverlapMenuItems(store, { x, y }),
    { label: '-' },
    ...getBottomBaseMenuItems(model),
  ];

  return {
    items: menuItems,
    x,
    y,
  };
}
