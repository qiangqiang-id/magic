import Delta from 'quill-delta';

/**
 * 获取文字索引和样式属性
 */
export function getCharAttrs(delta: Delta, defaultColor: string): [] {
  return delta.ops
    ?.map((op: Delta, index: number) => {
      if (!op.attributes) return null;
      const { color, background } = op.attributes;
      return {
        influence: 0,
        /** 6表示背景颜色，0表示文字颜色，同时存在使用6，
         *  设置了背景，必须携带文字颜色 */
        style: background ? 6 : 0,
        color: color || defaultColor,
        bgColor: background || '',
        start: calcAttrIndex(delta.ops, op, index)[0],
        endPos: calcAttrIndex(delta.ops, op, index)[1],
      };
    })
    .filter(item => item);
}

/**
 * 计算索引
 */
function calcAttrIndex(
  ops: Delta,
  curOp: Delta,
  index: number
): [number, number] {
  let start = 0;
  let end = 0;
  for (let i = 0; i < index; i += 1) {
    start += ops[i].insert.length;
  }
  end = start + curOp.insert.length;

  return [start, end];
}
