enum CmdEnum {
  /** 复制 */
  'COPY',

  /** 剪切 */
  'CUT',

  /** 粘贴 */
  'PASTE',

  /** 撤销 */
  'UNDO',

  /** 恢复 */
  'REDO',

  /** 删除 */
  'DELETE',

  /** 取消 */
  'ESC',

  /** 向上 */
  'TO UP',

  /** 向下 */
  'TO BUTTOM',

  /** 向左 */
  'TO LEFT',

  /** 向右 */
  'TO RIGHT',

  /** 向上 10px */
  'TO UP 10PX',

  /** 向下 10px */
  'TO BUTTOM 10PX',

  /** 向左 10px */
  'TO LEFT 10PX',

  /** 向右 10px */
  'TO RIGHT 10PX',

  /** 保存 */
  'SAVE',

  /** 全选 */
  'SELECT ALL',

  /** 多选 */
  'SELECT MULTI',

  /** 放大画布 */
  'ZOOM IN',

  /** 缩小画布 */
  'ZOOM OUT',

  /** 组合 */
  'GROUP',

  /** 打散组合 */
  'BREAK GROUP',

  /** 锁定 */
  'LOCK',

  /** 解锁 */
  'UNLOCK',

  /** 预览 */
  'PREVIEW',
}

export default CmdEnum;
