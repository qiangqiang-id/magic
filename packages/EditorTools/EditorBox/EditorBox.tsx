import * as React from 'react';
import cx from 'classnames';
import ScaleHandler from '../core/ScaleHandler';
import MaskCoverScaleHandler from '../core/MaskCoverScaleHandler';
import MaskContainScaleHandler from '../core/MaskContainScaleHandler';
import RotateHandler from '../core/RotateHandler';
import { EditorBoxProps } from './props';

import dragAction from '../core/dragAction';
import { POINT_TYPE } from '../enum/point-type';
import {
  POINT_LIST,
  POINT_CURSORS,
  MIN_SPACING,
  VERTICAL_AXIS_WIDTH,
  HORIZONTAL_AXIS_WIDTH,
  prefixCls,
  ScaleTypeMap,
} from '../constants/EditorBox';
import { ALL_POINT } from '../constants/Points';
import { getMaskInCanvasRectData } from '../helper/math';
import { processToEditableData, processToRawData } from '../helper/utils';
import './EditorBox.less';

function isVisible(point: POINT_TYPE, width: number, height: number) {
  if ([POINT_TYPE.BOTTOM_CENTER, POINT_TYPE.TOP_CENTER].includes(point)) {
    return width - HORIZONTAL_AXIS_WIDTH > MIN_SPACING;
  }

  if ([POINT_TYPE.LEFT_CENTER, POINT_TYPE.RIGHT_CENTER].includes(point)) {
    return height - VERTICAL_AXIS_WIDTH > MIN_SPACING;
  }

  return true;
}

const scaleHandleMap = {
  [ScaleTypeMap.default]: ScaleHandler,
  [ScaleTypeMap.maskCover]: MaskCoverScaleHandler,
  [ScaleTypeMap.maskContain]: MaskContainScaleHandler,
};

export default function EditorBox(props: EditorBoxProps) {
  const {
    onStartScale,
    rectInfo,
    onScale,
    onEndScale,
    onRotateStart,
    onRotate,
    onRotateEnd,
    points,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    className,
    editorPanelStyle,
    style,
    scaleType = ScaleTypeMap.default,
    isShowRotate = true,
    isShowPoint = true,
    isLockProportions = true,
    zoomLevel = 1,
    extra,
    ...otherMouseEvent
  } = props;

  /** 当前编辑点 */
  const [currentEditPoint, setCurrentEditPoint] =
    React.useState<POINT_TYPE | null>(null);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [pointList, setPointList] = React.useState(POINT_LIST);
  const [currentRotate, setCurrentRotate] = React.useState(0);

  const editorBoxRef = React.useRef<HTMLDivElement>(null);

  /** 数据转换 */
  const rectData = React.useMemo(
    () => processToEditableData(rectInfo, zoomLevel),
    [rectInfo, zoomLevel]
  );

  React.useEffect(() => {
    if (points) {
      setPointList(POINT_LIST.filter(({ point }) => points.includes(point)));
    }
  }, [points]);

  const maskInCanvasRectData = React.useMemo(
    () => getMaskInCanvasRectData(rectData),
    [rectData]
  );

  const containerStyle = React.useMemo(() => {
    const { width, height, x, y, rotate } = maskInCanvasRectData;

    return {
      width,
      height,
      transform: `translate(${x}px,${y}px) rotate(${rotate}deg)`,
      ...style,
    };
  }, [maskInCanvasRectData]);

  /** 拉伸 */
  const handleScale = (pointType: POINT_TYPE, e: React.MouseEvent) => {
    const Handle = scaleHandleMap[scaleType];

    const options = onStartScale?.(pointType, e.nativeEvent);
    const scaleHandler = new Handle(rectData, pointType, {
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      isLockProportions,
      ...options,
    });

    /** 编辑框的定位容器信息 */
    const baseContainerRect =
      editorBoxRef.current?.parentElement?.getBoundingClientRect();
    if (!baseContainerRect) return;

    dragAction(e.nativeEvent, {
      init: () => {
        setCurrentEditPoint(pointType);
        setIsEditing(true);
      },
      move: e => {
        const mousePosition = {
          x: e.clientX - baseContainerRect.x,
          y: e.clientY - baseContainerRect.y,
        };
        const data = scaleHandler.onScale(mousePosition);
        onScale?.(
          processToRawData({ ...rectData, ...data }, zoomLevel),
          pointType,
          e
        );
      },
      end: e => {
        onEndScale?.(pointType, e);
        setCurrentEditPoint(null);
        setIsEditing(false);
      },
    });
  };

  /** 旋转 */
  const handleRotate = (e: React.MouseEvent) => {
    /** 编辑框的定位容器信息 */
    const baseContainerRect =
      editorBoxRef.current?.parentElement?.getBoundingClientRect();
    if (!baseContainerRect) return;

    const { rotate = 0 } = rectData;
    setCurrentRotate(rotate);

    const mouseStartData = {
      x: e.clientX - baseContainerRect.x,
      y: e.clientY - baseContainerRect.y,
    };

    const rotateHandler = new RotateHandler(rectData, mouseStartData, rotate);

    dragAction(e.nativeEvent, {
      init: e => {
        setCurrentEditPoint(POINT_TYPE.ROTATE);
        setIsEditing(true);
        onRotateStart?.(e);
      },
      move: e => {
        const mousePosition = {
          x: e.clientX - baseContainerRect.x,
          y: e.clientY - baseContainerRect.y,
        };

        const data = rotateHandler.onRotate(mousePosition);
        setCurrentRotate(data);
        onRotate?.(data, e);
      },
      end: e => {
        onRotateEnd?.(e);
        setCurrentEditPoint(null);
        setIsEditing(false);
      },
    });
  };

  /**  渲染锚点 */
  const renderPoints = () => {
    const cursors: Record<string, string> = {};
    let { rotate = 0 } = rectData;
    const { width, height } = rectData;
    if (rotate < 0) {
      rotate += 360;
    }
    const angle = Math.round((rotate % 360) / 45);
    for (let i = 0; i < ALL_POINT.length; i += 1) {
      cursors[ALL_POINT[i]] = `${POINT_CURSORS[(i + angle) % 4]}-resize`;
    }

    return pointList.map(({ point, className }) => {
      const cursor = cursors[point];

      const isHide =
        (currentEditPoint !== point && isEditing) ||
        !isVisible(point, width, height) ||
        !isShowPoint;

      const styles: React.CSSProperties = {
        cursor,
        visibility: isHide ? 'hidden' : 'visible',
      };
      return (
        <div
          key={point}
          style={styles}
          onMouseDown={e => {
            e.stopPropagation();
            handleScale(point, e);
          }}
          className={cx('editor-grip', `editor-grip-${className}`)}
        >
          <i />
        </div>
      );
    });
  };

  const isHideRotate =
    (currentEditPoint !== POINT_TYPE.ROTATE && isEditing) ||
    !isShowPoint ||
    !isShowRotate;

  const isShowRotateTip = currentEditPoint === POINT_TYPE.ROTATE;

  return (
    <div
      style={containerStyle}
      ref={editorBoxRef}
      className={cx(prefixCls, className)}
    >
      <div
        className="editor-panel"
        style={{
          ...editorPanelStyle,
        }}
        {...otherMouseEvent}
      />

      {renderPoints()}

      {/* 旋转图标 */}
      <span
        style={{
          transform: `translateX(-50%) rotate(${-currentRotate}deg)`,
          visibility: isHideRotate ? 'hidden' : 'visible',
        }}
        onMouseDown={handleRotate}
        className="rotate-icon"
      >
        <svg
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
        >
          <path
            fill="currentColor"
            d="M15.25 18.48V15a.75.75 0 1 0-1.5 0v4c0 .97.78 1.75 1.75 1.75h4a.75.75 0 1 0 0-1.5h-2.6a8.75 8.75 0 0 0-2.07-15.53.75.75 0 1 0-.49 1.42 7.25 7.25 0 0 1 .91 13.34zM8.75 5.52V9a.75.75 0 0 0 1.5 0V5c0-.97-.78-1.75-1.75-1.75h-4a.75.75 0 0 0 0 1.5h2.6a8.75 8.75 0 0 0 2.18 15.57.75.75 0 0 0 .47-1.43 7.25 7.25 0 0 1-1-13.37z"
          />
        </svg>

        <div
          className={cx('preview-tip', 'preview-rotate')}
          style={{
            visibility: isShowRotateTip ? 'visible' : 'hidden',
          }}
        >
          {Math.floor(currentRotate)}°
        </div>
      </span>

      {/* 自定义 */}
      {typeof extra === 'function' ? extra(maskInCanvasRectData) : extra}
    </div>
  );
}
