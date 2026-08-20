import { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { dragAction } from '@p/EditorTools';
import { CANVAS_WRAPPER } from '@/constants/Refs';

interface CanvasPanStart {
  x: number;
  y: number;
  left: number;
  top: number;
  scrollLeft: number;
  scrollTop: number;
  canvasRect: DOMRect;
}

export default function useCanvasPan(canvasRef: RefObject<HTMLElement>) {
  const getCanvasElements = () => {
    const canvas = canvasRef.current;
    const canvasWrapper = CANVAS_WRAPPER.current;
    if (!canvas || !canvasWrapper) return null;

    return { canvas, canvasWrapper };
  };

  const moveCanvas = (
    moveEvent: MouseEvent,
    start: CanvasPanStart,
    canvas: HTMLElement,
    canvasWrapper: HTMLElement
  ) => {
    const moveX = moveEvent.clientX - start.x;
    const moveY = moveEvent.clientY - start.y;

    canvas.style.left = `${start.left}px`;
    canvas.style.top = `${start.top}px`;
    canvasWrapper.scrollLeft = start.scrollLeft - moveX;
    canvasWrapper.scrollTop = start.scrollTop - moveY;

    const scrollMoveX = start.scrollLeft - canvasWrapper.scrollLeft;
    const scrollMoveY = start.scrollTop - canvasWrapper.scrollTop;
    const nextLeft = start.left + moveX - scrollMoveX;
    const nextTop = start.top + moveY - scrollMoveY;
    canvas.style.left = `${nextLeft}px`;
    canvas.style.top = `${nextTop}px`;

    const movedCanvasRect = canvas.getBoundingClientRect();
    canvas.style.left = `${
      nextLeft + start.canvasRect.left + moveX - movedCanvasRect.left
    }px`;
    canvas.style.top = `${
      nextTop + start.canvasRect.top + moveY - movedCanvasRect.top
    }px`;
  };

  const handleCanvasPan = (event: ReactMouseEvent) => {
    const elements = getCanvasElements();
    if (!elements) return;

    event.preventDefault();

    const { canvas, canvasWrapper } = elements;
    const start = {
      x: event.clientX,
      y: event.clientY,
      left: Number.parseFloat(canvas.style.left) || 0,
      top: Number.parseFloat(canvas.style.top) || 0,
      scrollLeft: canvasWrapper.scrollLeft,
      scrollTop: canvasWrapper.scrollTop,
      canvasRect: canvas.getBoundingClientRect(),
    };
    const bodyCursor = document.body.style.cursor;

    dragAction(event.nativeEvent, {
      init: () => {
        canvasWrapper.style.cursor = 'grabbing';
        document.body.style.cursor = 'grabbing';
      },
      move: moveEvent => {
        moveCanvas(moveEvent, start, canvas, canvasWrapper);
      },
      end: () => {
        canvasWrapper.style.removeProperty('cursor');
        document.body.style.cursor = bodyCursor;
      },
    });
  };

  return handleCanvasPan;
}
