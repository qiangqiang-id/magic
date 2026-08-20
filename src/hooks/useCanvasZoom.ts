import {
  CSSProperties,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { CANVAS_WRAPPER } from '@/constants/Refs';
import { useStores } from '@/store';
import useResizeObserver from './useResizeObserver';

const ZOOM_ANIMATION_DURATION = 180;
const WHEEL_DELTA_PER_STEP = 10;
const WHEEL_ZOOM_STEP = 0.01;

interface ZoomAnchor {
  x: number;
  y: number;
  viewportX: number;
  viewportY: number;
}

export default function useCanvasZoom(
  canvasRef: RefObject<HTMLElement>,
  canvasWidth: number,
  canvasHeight: number,
  isOpenImageCrop: boolean
) {
  const { OS } = useStores();
  const { zoomLevel } = OS;

  const hasAdaptedZoomRef = useRef(false);
  const previousZoomLevelRef = useRef(zoomLevel);
  const wheelDeltaRef = useRef(0);
  const zoomAnchorRef = useRef<ZoomAnchor | null>(null);
  const zoomAnimationTimerRef = useRef<number | null>(null);

  const [entry] = useResizeObserver(CANVAS_WRAPPER);

  const canvasStyle: CSSProperties = {
    width: canvasWidth * zoomLevel,
    height: canvasHeight * zoomLevel,
  };
  const cropStyle: CSSProperties = {
    width: CANVAS_WRAPPER.current?.clientWidth,
    height: CANVAS_WRAPPER.current?.clientHeight,
  };

  const getCanvasElements = () => {
    const canvas = canvasRef.current;
    const canvasWrapper = CANVAS_WRAPPER.current;
    if (!canvas || !canvasWrapper) return null;

    return { canvas, canvasWrapper };
  };

  const getWheelDelta = (event: WheelEvent, canvasWrapper: HTMLElement) => {
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      return event.deltaY * 16;
    }
    if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      return event.deltaY * canvasWrapper.clientHeight;
    }
    return event.deltaY;
  };

  const isWheelZoomDisabled = (event: WheelEvent) => {
    const target = event.target;
    return (
      !event.deltaY ||
      OS.isEditing ||
      (target instanceof Element &&
        !!target.closest('input, textarea, [contenteditable="true"]'))
    );
  };

  const setZoomAnchor = (
    event: WheelEvent,
    canvas: HTMLElement,
    canvasWrapper: HTMLElement
  ) => {
    const canvasRect = canvas.getBoundingClientRect();
    const wrapperRect = canvasWrapper.getBoundingClientRect();
    zoomAnchorRef.current = {
      x: Math.min(
        1,
        Math.max(0, (event.clientX - canvasRect.left) / canvasRect.width)
      ),
      y: Math.min(
        1,
        Math.max(0, (event.clientY - canvasRect.top) / canvasRect.height)
      ),
      viewportX: event.clientX - wrapperRect.left,
      viewportY: event.clientY - wrapperRect.top,
    };
  };

  const handleCanvasWheel = (
    event: WheelEvent,
    canvas: HTMLElement,
    canvasWrapper: HTMLElement
  ) => {
    if (isWheelZoomDisabled(event)) return;

    event.preventDefault();
    wheelDeltaRef.current += getWheelDelta(event, canvasWrapper);

    const steps = Math.trunc(wheelDeltaRef.current / WHEEL_DELTA_PER_STEP);
    if (!steps) return;

    wheelDeltaRef.current -= steps * WHEEL_DELTA_PER_STEP;
    const zoomDelta = -steps * WHEEL_ZOOM_STEP;
    if ((zoomDelta > 0 && !OS.canZoomIn) || (zoomDelta < 0 && !OS.canZoomOut)) {
      wheelDeltaRef.current = 0;
      return;
    }

    setZoomAnchor(event, canvas, canvasWrapper);
    OS.setZoomLevel(OS.zoomLevel + zoomDelta);
  };

  const registerCanvasWheel = () => {
    const elements = getCanvasElements();
    if (!elements) return undefined;

    const { canvas, canvasWrapper } = elements;
    const handleWheel = (event: WheelEvent) => {
      handleCanvasWheel(event, canvas, canvasWrapper);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  };

  const clearZoomAnimationTimer = () => {
    if (zoomAnimationTimerRef.current === null) return;

    window.clearTimeout(zoomAnimationTimerRef.current);
    zoomAnimationTimerRef.current = null;
  };

  const resetZoomAnimation = (canvas: HTMLElement) => {
    clearZoomAnimationTimer();
    canvas.style.removeProperty('transition');
    canvas.style.removeProperty('transform');
  };

  const getCurrentAnimationScale = (canvas: HTMLElement) => {
    const computedTransform = window.getComputedStyle(canvas).transform;
    const transformScale = computedTransform.match(
      /^matrix(?:3d)?\(([^,]+)/
    )?.[1];
    return computedTransform === 'none' || !transformScale
      ? 1
      : Number(transformScale);
  };

  const alignCanvasToZoomAnchor = (
    canvas: HTMLElement,
    canvasWrapper: HTMLElement
  ) => {
    const wrapperRect = canvasWrapper.getBoundingClientRect();
    const zoomAnchor = zoomAnchorRef.current;
    const viewportX = zoomAnchor?.viewportX ?? canvasWrapper.clientWidth / 2;
    const viewportY = zoomAnchor?.viewportY ?? canvasWrapper.clientHeight / 2;
    const anchorX = zoomAnchor?.x ?? 0.5;
    const anchorY = zoomAnchor?.y ?? 0.5;

    canvas.style.transformOrigin = `${anchorX * 100}% ${anchorY * 100}%`;

    const finalCanvasRect = canvas.getBoundingClientRect();
    canvasWrapper.scrollLeft +=
      finalCanvasRect.left +
      finalCanvasRect.width * anchorX -
      wrapperRect.left -
      viewportX;
    canvasWrapper.scrollTop +=
      finalCanvasRect.top +
      finalCanvasRect.height * anchorY -
      wrapperRect.top -
      viewportY;

    /** 小画布没有滚动空间，用相对偏移补齐被夹掉的锚点位移 */
    const anchoredCanvasRect = canvas.getBoundingClientRect();
    canvas.style.left = `${
      wrapperRect.left +
      viewportX -
      anchoredCanvasRect.left -
      anchoredCanvasRect.width * anchorX
    }px`;
    canvas.style.top = `${
      wrapperRect.top +
      viewportY -
      anchoredCanvasRect.top -
      anchoredCanvasRect.height * anchorY
    }px`;
  };

  const playZoomAnimation = (canvas: HTMLElement, startScale: number) => {
    const isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (isReducedMotion || Math.abs(startScale - 1) <= 0.001) return;

    canvas.style.transform = `scale(${startScale})`;
    /** 提交动画起始帧，避免浏览器合并两次 transform 更新 */
    canvas.getBoundingClientRect();
    canvas.style.transition = `transform ${ZOOM_ANIMATION_DURATION}ms cubic-bezier(0.2, 0, 0, 1)`;
    canvas.style.transform = 'scale(1)';
    zoomAnimationTimerRef.current = window.setTimeout(() => {
      resetZoomAnimation(canvas);
    }, ZOOM_ANIMATION_DURATION);
  };

  const handleZoomLevelChange = () => {
    const elements = getCanvasElements();
    if (!elements) return;

    const previousZoomLevel = previousZoomLevelRef.current;
    if (previousZoomLevel === zoomLevel) return;

    const { canvas, canvasWrapper } = elements;
    const currentVisualZoomLevel =
      previousZoomLevel * getCurrentAnimationScale(canvas);

    resetZoomAnimation(canvas);
    canvas.style.left = '0';
    canvas.style.top = '0';
    alignCanvasToZoomAnchor(canvas, canvasWrapper);
    playZoomAnimation(canvas, currentVisualZoomLevel / zoomLevel);

    previousZoomLevelRef.current = zoomLevel;
    zoomAnchorRef.current = null;
  };

  const centerCanvasForCrop = () => {
    if (!isOpenImageCrop) return;

    const elements = getCanvasElements();
    if (!elements) return;

    const { canvas, canvasWrapper } = elements;
    resetZoomAnimation(canvas);
    canvas.style.removeProperty('left');
    canvas.style.removeProperty('top');

    const canvasRect = canvas.getBoundingClientRect();
    const wrapperRect = canvasWrapper.getBoundingClientRect();
    canvasWrapper.scrollLeft +=
      canvasRect.left +
      canvasRect.width / 2 -
      wrapperRect.left -
      canvasWrapper.clientWidth / 2;
    canvasWrapper.scrollTop +=
      canvasRect.top +
      canvasRect.height / 2 -
      wrapperRect.top -
      canvasWrapper.clientHeight / 2;
  };

  const adaptCanvasZoom = () => {
    if (!entry || hasAdaptedZoomRef.current || !canvasWidth || !canvasHeight) {
      return;
    }

    const { width, height } = entry.contentRect;
    const fitZoomLevel = Math.floor(
      Math.min(width / canvasWidth, height / canvasHeight) * 100
    );

    OS.setZoomLevel(fitZoomLevel / 100);
    hasAdaptedZoomRef.current = true;
  };

  const registerZoomAnimationCleanup = () => clearZoomAnimationTimer;

  useEffect(registerCanvasWheel, [OS]);
  useLayoutEffect(handleZoomLevelChange, [zoomLevel]);
  useLayoutEffect(centerCanvasForCrop, [entry, isOpenImageCrop]);
  useEffect(adaptCanvasZoom, [canvasHeight, canvasWidth, entry, OS]);
  useEffect(registerZoomAnimationCleanup, []);

  return { canvasStyle, cropStyle };
}
