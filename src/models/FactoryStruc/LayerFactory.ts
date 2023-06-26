import { LayerType } from '@/constants/LayerTypeEnum';
import LayerStruc, {
  TextStruc,
  ImageStruc,
  ShapeStruc,
  GroupStruc,
  BackgroundStruc,
} from '../LayerStruc';
import SceneStruc from '../SceneStruc';

const LayerTypeMapStruc: Record<LayerType, typeof LayerStruc> = {
  [LayerType.TEXT]: TextStruc,
  [LayerType.BACKGROUND]: BackgroundStruc,
  [LayerType.IMAGE]: ImageStruc,
  [LayerType.GROUP]: GroupStruc,
  [LayerType.SHAPE]: ShapeStruc,
  [LayerType.UNKNOWN]: TextStruc,
};

export default function CreateCmpStruc<
  T extends keyof typeof LayerTypeMapStruc
>(
  type: T,
  data?: Partial<LayerModel.Layer>,
  parent?: SceneStruc | GroupStruc | null
) {
  const Structure = LayerTypeMapStruc[type];
  if (!Structure) throw new Error(`${type}组件暂未实现`);

  const structure = new Structure(data);

  if (parent instanceof SceneStruc) {
    structure.scene = parent;
  } else if (parent instanceof GroupStruc) {
    structure.group = parent;
  } else {
    structure.scene = null;
    structure.group = null;
  }

  return structure;
}
