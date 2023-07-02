/**
 * 过滤相同的数据
 * @param data 当前数据数据
 * @param targetData 目标数据
 * @returns
 */
export function filterSameData<T = Record<string, any>>(
  data: T,
  targetData: Partial<T>
) {
  const newTargetData: Partial<T> = {};
  for (const key in targetData) {
    const val = targetData[key];
    if (data[key] === val) continue;

    newTargetData[key] = val;
  }
  return newTargetData;
}
