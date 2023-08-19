import { makeAutoObservable } from 'mobx';

export default class SettingStore {
  /** 是否打开图像裁剪 */
  isOpenImageCrop = false;

  constructor() {
    makeAutoObservable(this);
  }

  openImageCrop() {
    this.isOpenImageCrop = true;
  }

  closeImageCrop() {
    this.isOpenImageCrop = false;
  }
}
