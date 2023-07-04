/**
 * 制作一个图片
 * @param url 图片地址
 * @param width 设置宽
 * @param height 设置高
 * @returns image 对象
 */
export function makeImage(
  url: string,
  width?: number,
  height?: number
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image(width, height);
    image.crossOrigin = 'anonymous';
    image.src = url;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error('制作图片失败'));
    };
  });
}
