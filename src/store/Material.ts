import { makeAutoObservable } from 'mobx';
import { MaterialEnum } from '@/constants/MaterialEnum';

export default class MaterialStore {
  /** 当前激活 */
  public activeMenu: MaterialEnum = MaterialEnum.IMAGE;

  constructor() {
    makeAutoObservable(this);
  }

  changeMenu = (value: MaterialEnum) => {
    this.activeMenu = value;
  };

  closeMenu = () => {
    this.activeMenu = MaterialEnum.DEFAULT;
  };
}
