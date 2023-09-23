import { observer } from 'mobx-react';
import { fileToBase64 } from '@/utils/file';
import UploadBtn from '@/components/UploadBtn';
import { makeImage } from '@/utils/image';
import { magic } from '@/store';

import { MIME_TYPES } from '@/constants/MimeTypes';

function Image() {
  const { activedScene } = magic;
  const addImage = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = await fileToBase64(file);
    const { width, height } = await makeImage(url);

    activedScene?.addImage({
      name: file.name,
      width,
      height,
      url,
      mimeType: file.type,
    });
  };

  return (
    <div>
      <UploadBtn
        onChange={addImage}
        btnTitle="添加图片"
        accept={Object.values(MIME_TYPES).join(',')}
      />
    </div>
  );
}

export default observer(Image);
