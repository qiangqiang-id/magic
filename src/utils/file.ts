/**
 * 文件转dataURl
 * @param file 文件
 * @returns
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e: Record<string, any>) => {
      resolve(e.target.result);
    };
    fileReader.readAsDataURL(file);
    fileReader.onerror = () => {
      reject(new Error('fileToBase64 error'));
    };
  });
