/**
 * @example
 *
 * random(3)
 * 1
 *
 * random(3, 1)
 * // => 2
 *
 * random(45, 49)
 * // => 45
 *
 * random(1, 20)
 * // => 8
 */
export const random = (min = 0, max = 10) => {
  const minVal = Math.min(min, max);
  const maxVal = Math.max(min, max);
  return Math.floor(Math.random() * (maxVal - minVal + 1) + minVal);
};

/**
 * 返回一个永不重复的字符串
 * @returns {string} 字符串结果
 */
export function randomString(): string {
  return `${Math.random().toString(36).slice(2)}${new Date()
    .getTime()
    .toString(36)}`;
}

/**
 * 生成本地永不重复的id
 * @param prefix 前缀
 * @param binary 进制 - 任意输入返回`2 - 36`进制
 * @returns {string} 本地的id
 */
export function localUniqueid(prefix?: string, binary?: number): string {
  const bin = binary ? (binary < 0 ? 2 : binary > 36 ? 36 : binary) : 16;
  const id = `${Date.now()}${Math.random().toString(bin).substring(2, 10)}`;
  return `${prefix || ''}${id}`;
}
