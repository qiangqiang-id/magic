import { HistoryRecord } from '@/types/history';
import HistoryManager from '../Manager/History';
import LayerStruc from '@/models/LayerStruc';

type ReverseAction<T> = (this: T, ...rest: any[]) => void;

type ReverseActionCreator<T> = (
  this: T,
  ...rest: any[]
) => ReverseAction<T> | null;

/**
 * 创建历史记录装饰器
 * 传入函数为当前动作的逆向动作：添加 --> 删除
 * 若记录的动作没有逆向动作，则不记录
 */
export function createDecorator<T>() {
  return function historyDecorator(reverseAction: ReverseActionCreator<T>) {
    return function decotatorRecord(
      _target: T /** class */,
      name: string /** method key */,
      desc: PropertyDescriptor /** 属性的描述对象 */
    ) {
      /** 装饰的属性方法 */
      const originalAction = desc.value;
      /** 重新给装饰的方式赋值 */
      desc.value = function decotatorAction(this: T, ...rest: any[]) {
        /**  获取逆向动作，若返回`null`，则不记录，传入的参数 callback 的返回值 */
        const reverse = reverseAction.apply(this, rest);

        if (typeof reverse === 'function') {
          /** 重做动作，则取原始动作 */
          const obverse = () => originalAction.apply(this, rest);
          const record: HistoryRecord = {
            name,
            context: rest,
            reverse,
            obverse,
          };
          HistoryManager.push(record);
        }
        return originalAction.apply(this, rest);
      };
      return desc;
    };
  };
}

/**
 * 作品操作历史记录
 */
export const magicHistoryDecorator = createDecorator<MagicModel>();

/**
 * 场景操作历史记录
 */
export const sceneHistoryDecorator = createDecorator<SceneModel>();

/**
 * 图层操作历史记录
 */
export const layerHistoryDecorator = createDecorator<LayerStruc>();
