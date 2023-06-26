import {
  TextStruc,
  ImageStruc,
  BackgroundStruc,
  ShapeStruc,
  GroupStruc,
} from '@/models/LayerStruc';

export type Layer =
  | TextStruc
  | ImageStruc
  | BackgroundStruc
  | ShapeStruc
  | GroupStruc;
