import { createContext } from './CreateContext';
import { cloneNode } from './CloneNode';
import { removeDefaultStyleSandbox } from './CopyCssStyles';
import { createForeignObjectSvg, svgToDataUrl } from './Svg';

import { makeImage } from '@/utils/image';
import { imageToBlob } from './ImageToBlob';

export interface Options {
  // key 为 字体的fontFamily ，value 为 url
  fontMap?: Record<string, string>;
  width?: number;
  height?: number;
  backgroundColor?: string;
  style?: Partial<CSSStyleDeclaration> | null;
  type?: 'image/png' | 'image/jpeg';
  debug?: boolean;
}

export default async function screenshot<T extends Node>(
  node: T,
  options: Options
): Promise<Blob> {
  const { debug } = options;
  const context = createContext(node, options);
  debug && console.time('cloneNode');
  const clone = cloneNode(node, context);
  debug && console.timeEnd('cloneNode');

  removeDefaultStyleSandbox();
  debug && console.time('runTask');
  const runTask = async () => {
    while (true) {
      const task = context.tasks.pop();
      if (!task) break;
      try {
        // eslint-disable-next-line no-await-in-loop
        await task;
      } catch (error) {
        console.warn('任务失败', error);
      }
    }
  };
  await Promise.all([...Array(4)].map(runTask));
  debug && console.timeEnd('runTask');

  const svg = createForeignObjectSvg(clone, context);
  svg.insertBefore(context.svgRootStyleElement, svg.children[0]);
  const dataUrl = svgToDataUrl(svg);
  const image = await makeImage(dataUrl, context.width, context.height);
  return imageToBlob(context, image);
}
