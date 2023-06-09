/**
 * 键盘值对照表
 */
const KeyCodeMap = {
  // 字母
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,

  // 横排数字键
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,

  // 小键盘
  /** 小键盘0 */
  MIN_0: 96,
  /** 小键盘1 */
  MIN_1: 97,
  /** 小键盘2 */
  MIN_2: 98,
  /** 小键盘3 */
  MIN_3: 99,
  /** 小键盘4 */
  MIN_4: 100,
  /** 小键盘5 */
  MIN_5: 101,
  /** 小键盘6 */
  MIN_6: 102,
  /** 小键盘7 */
  MIN_7: 103,
  /** 小键盘8 */
  MIN_8: 104,
  /** 小键盘9 */
  MIN_9: 105,
  /** 小键盘* */
  '*': 106,
  /** 小键盘+ */
  '+': 107,
  /** 小键盘回车 */
  MIN_ENTER: 108,
  /** 小键盘- */
  '-': 109,
  /** 小键盘 小数点 . */
  '.': 110,
  /** 小键盘/ */
  '/': 111,

  // F键位
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,

  // 控制键
  BACKSPACE: 8,
  TAB: 9,
  CLEAR: 12,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  CAPE_LOCK: 20,
  ESC: 27,
  SPACEBAR: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  INSERT: 45,
  DELETE: 46,
  NUM_LOCK: 144,

  // 标点符号键
  ';:': 186,
  '=+': 187,
  ',<': 188,
  '-_': 189,
  '.>': 190,
  '/?': 191,
  '`~': 192,
  '[{': 219,
  '|': 220,
  ']}': 221,
  '"': 222,

  // 多媒体按键
  /** 音量加 */
  VOLUME_UP: 175,
  /** 音量减 */
  VOLUME_DOWN: 174,
  /** 停止 */
  STOP: 179,
  /** 静音 */
  MUTE: 173,
  /** 浏览器 */
  BROWSER: 172,
  /** 邮件 */
  EMAIL: 180,
  /** 搜索 */
  SEARCH: 170,
  /** 收藏 */
  COLLECT: 171,
};

export default KeyCodeMap;
