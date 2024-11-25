import { blobToDataUrl } from './File';

/**
 * 加载blob
 * @param {string} url
 * @return {*}  {Promise<Blob>}
 */
export function fetchBlob(url: string): Promise<Blob> {
  return fetch(url).then(res => res.blob().then(blob => blob));
}

/**
 * 加载dataUrl
 * @param {string} url
 * @return {*}  {Promise<string>}
 */
export function fetchDataUrl(url: string): Promise<string> {
  return fetchBlob(url).then(blob => blobToDataUrl(blob));
}

/**
 * 加载 ArrayBuffer
 * @param {string} url
 * @return {*}  {Promise<ArrayBuffer>}
 */
export function fetchArrayBuffer(url: string): Promise<ArrayBuffer> {
  return fetch(url).then(res => res.arrayBuffer());
}
