import type { Context } from './CreateContext';

/**
 * 图片元素 转 blob
 * @param context
 * @param image
 * @returns Promise<Blob>
 */
export function imageToBlob(
  context: Context,
  image: HTMLImageElement
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { width = 0, height = 0, type } = context;
    const canvas = image.ownerDocument.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(image, 0, 0, width, height);
    // canvas 默认格式为 image/png
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('imageToBlob fail'));
    }, type);
  });
}
