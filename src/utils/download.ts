import { fetchBlob } from '@p/Screenshot/Fetch';
import FileSaver from 'file-saver';

/**
 * 单个下载
 * @param url
 * @param name
 */
export const singleDownload = async (
  url: string,
  name?: string
): Promise<void> => {
  const blob = await fetchBlob(url);
  const suffix = blob.type.split('/')[1];
  FileSaver.saveAs(blob, `${name}.${suffix}`);
};
