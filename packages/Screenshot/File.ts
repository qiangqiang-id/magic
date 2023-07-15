/**
 * blob 转 dataUrl
 * @param {Blob} blob
 * @return {*}  {Promise<string>}
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const content = (reader.result as string).split(/,/)[1];
      if (content) resolve(reader.result as string);
      else reject(new Error('DataUrl 为空'));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
