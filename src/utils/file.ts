/**
 * 文件转dataURl
 * @param file 文件
 * @returns
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      resolve((e.target?.result || '') as string);
    };
    fileReader.readAsDataURL(file);
    fileReader.onerror = () => {
      reject(new Error('fileToBase64 error'));
    };
  });
