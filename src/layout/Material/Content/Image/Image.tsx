import { observer } from 'mobx-react';
import { Button } from 'antd';
import { fileToBase64 } from '@/utils/file';
import Upload from '@/components/Upload';
import { makeImage } from '@/utils/image';
import { magic } from '@/store';

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
    <Upload accept={['image/*']} onChange={addImage}>
      <Button type="primary" block>
        添加图片
      </Button>
    </Upload>
  );
}

export default observer(Image);
