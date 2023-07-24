import { LayerTypeEnum } from '@/constants/LayerTypeEnum';
import LayerStruc, {
  TextStruc,
  ImageStruc,
  ShapeStruc,
  GroupStruc,
  BackgroundStruc,
} from '../LayerStruc';
import SceneStruc from '../SceneStruc';

const LayerTypeMapStruc: Record<
  LayerModel.LayerType,
  typeof LayerStruc | null
> = {
  [LayerTypeEnum.TEXT]: TextStruc,
  [LayerTypeEnum.BACKGROUND]: BackgroundStruc,
  [LayerTypeEnum.IMAGE]: ImageStruc,
  [LayerTypeEnum.GROUP]: GroupStruc,
  [LayerTypeEnum.SHAPE]: ShapeStruc,
  [LayerTypeEnum.UNKNOWN]: null,
};

export default function CreateLayerStruc<T extends LayerModel.LayerType>(
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
