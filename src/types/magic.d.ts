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

declare namespace LayerModel {
  /** 图层类型 */
  type LayerType =
    | 'Background'
    | 'Text'
    | 'Image'
    | 'Group'
    | 'Shape'
    | 'Unknown';

  /** 文字填充信息 */
  interface TextFill {
    /** 文字颜色 */
    color?: string;
    /** 透明度 0-100 */
    opacity?: number;
    /** 描边颜色 */
    strokeColor?: string;
    /** 描边宽度 */
    strokeWidth?: number;
    /** 描边透明度 0-100 */
    strokeAlpha?: number;
    /** 背景颜色 */
    backgroundColor?: string;
    /** 背景透明度 0-100 */
    backgroundAlpha?: number;
    /** 背景图片宽 */
    imageWidth?: number;
    /** 背景图片高 */
    imageHeight?: number;
    /** 背景图片名 */
    imageName?: string;
    /** 图片地址 */
    imageUrl?: string;
    /** 图片拉伸信息 */
    imageNinePath?: {
      /** 起始x位置 */
      x: number;
      /** 起始y位置 */
      y: number;
      /** 可拉伸宽 */
      w: number;
      /** 可拉伸高 */
      h: number;
    };
  }

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
  }

  /** 文字 */
  interface Text extends LayerModel.Base {
    /** 内容 */
    content?: string;
    /** 局部编辑属性 */
    charAttrs?: Record<string, any>[];
    /** 最大行数 */
    maxLines?: number;
    /** 是否可编辑 */
    isEdit?: boolean;
    fontFamily?: string;

    // todo: 数据结构需要改动
    /** 填充信息 */
    fill?: LayerModel.TextFill;
    fontSize?: number;
    lineHeight?: number;
  }

  /** 图片 */
  interface Image extends LayerModel.Base {
    /** 图片url地址 */
    url?: string;
    /** 原始宽度 */
    originalWidth?: number;
    /** 原始高度 */
    originalHeight?: number;
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

  // todo 完善
  /** 图形 */
  interface Shape extends LayerModel.Base {}

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
