/** 位置 */
interface Position {
  /** x轴 */
  x: number;
  /** y轴 */
  y: number;
}

/** 锚点 */
interface Anchor extends Position {}
/** 缩放 */
interface Scale extends Position {}

interface Stroke {
  /** 描边颜色 */
  strokeColor?: string;
  /** 描边宽度 */
  strokeWidth?: number;
  /** 描边透明度 0-100 */
  strokeAlpha?: number;
}

declare namespace LayerModel {
  /** 图层类型 */
  type LayerType =
    | 'Background'
    | 'Text'
    | 'Image'
    | 'Group'
    | 'Shape'
    | 'Unknown';

  interface Base {
    id: string;
    name?: string;
    type: LayerModel.LayerType;
    /** 锚点 */
    anchor?: Anchor;
    /** 缩放 */
    scale?: Scale;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    rotate?: number;
    actived?: boolean;
    /** 是否可见 */
    visible?: boolean;
    /** 是否锁定 */
    isLock?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 加载状态 */
    loading?: boolean;
    /** 透明度 */
    opacity?: number;
    /** 蒙层 */
    mask?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }

  /** 文字 */
  interface Text extends LayerModel.Base {
    /** 内容 */
    content?: string;
    /** 局部编辑属性 */
    charAttrs?: Record<string, any>[];
    /** 是否可编辑中 */
    isEditing?: boolean;
    /** 字体 */
    fontFamily?: string;
    /** 文字颜色 */
    color?: string;
    /** 描边 */
    strokes?: Stroke[];
    /** 字体大小 */
    fontSize?: number;
    /** 行高 */
    lineHeight?: number;
    /** 字间距 */
    letterSpacing?: number;
    /** 字体粗细 */
    fontWeight?: number;
    /** 背景颜色 */
    backgroundColor?: string;
    /** 背景透明度 0-100 */
    backgroundAlpha?: number;
    padding?: {
      top: number;
      left: number;
      bottom: number;
      right: number;
    };
  }

  /** 图片 */
  interface Image extends LayerModel.Base {
    /** 图片url地址 */
    url?: string;
    /** 原始宽度 */
    originalWidth?: number;
    /** 原始高度 */
    originalHeight?: number;
    /** 图片类型 */
    fileType?: string;
  }

  /** 背景 */
  interface Background extends LayerModel.Base {
    /** 背景填充类型 */
    fillType?: 'Color' | 'Image';
    /** 图片地址 */
    url?: string;
    /** 颜色 */
    color?: string;
  }

  /** 图形 */
  interface Shape extends LayerModel.Base {
    shapeType: 'rect';
    rx?: number;
    ry?: number;
    fill?: string;
    strokeColor?: string;
    strokeWidth?: number;
    /** 描边类型 */
    strokeType?: 'solid' | 'dashed' | 'dotted';
    /** 描边间隙，strokeType 不为 solid 生效 */
    strokeSpacing?: number;
    /** 描边每一节的长度，strokeType 不为 solid 生效 */
    strokeLength?: number;
  }

  /** 组合 */
  interface Group extends LayerModel.Base {
    layers?: LayerModel.Layer[];
  }

  type Layer =
    | LayerModel.Background
    | LayerModel.Image
    | LayerModel.Shape
    | LayerModel.Text;
}

declare interface SceneModel {
  id: string;
  name: string;
  /** 图层 */
  layers?: LayerModel.Layer[];
  /** 封面 */
  cover?: string;
  /** 画布宽 */
  width?: number;
  /** 画布高 */
  height?: number;
  /** 是否选中 */
  actived?: boolean | null;
}

declare interface MagicModel {
  /** 作品id */
  id: string | null;
  /** 作品名称 */
  name: string | null;
  /** 场景 */
  scenes: SceneModel[];
}
