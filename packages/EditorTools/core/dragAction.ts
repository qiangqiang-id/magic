/**
 * 传输参数
 * */
export interface DragExecutor {
  /** 鼠标按下触发事件 */
  init?: (event: MouseEvent) => void;
  /** 鼠标移动触发事件 */
  move?: (moveEvent: MouseEvent) => void;
  /** 鼠标抬起触发事件 */
  end?: (endEvent: MouseEvent) => void;
}

/**
 * drag事件
 **/
const dragAction = (event: MouseEvent, executors: DragExecutor) => {
  executors.init?.(event);
  const startMove = (moveEvent: MouseEvent) => {
    executors.move?.(moveEvent);
  };

  const endMove = (endEvent: MouseEvent) => {
    executors.end?.(endEvent);
    document.removeEventListener('mousemove', startMove);
    document.removeEventListener('mouseup', endMove);
  };

  document.addEventListener('mousemove', startMove);
  document.addEventListener('mouseup', endMove);
};

export default dragAction;
