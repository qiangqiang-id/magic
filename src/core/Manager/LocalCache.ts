const cacheDataType = {
  string: (value: string) => value,
  number: (value: string) => (value ? +value : null),
  boolean: (value: string) => value === 'true',
  object: (value: string) => (value ? JSON.parse(value) : null),
};

/**
 * 用户本地缓存设置
 */
export default class LocalCache {
  static get<T extends keyof typeof cacheDataType>(
    key: string,
    type: T
  ): ReturnType<(typeof cacheDataType)[T]> | null {
    try {
      const value = window.localStorage.getItem(key);
      const dataType = cacheDataType[type];
      return value && dataType ? dataType(value) : value;
    } catch (error: unknown & any) {
      console.error('缓存读取异常=%s', error.message);
      return null;
    }
  }

  static set(key: string, value: any) {
    try {
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      window.localStorage.setItem(key, String(value));
    } catch (error: unknown & any) {
      console.error('缓存写入异常=%s', error.message);
    }
  }
}
