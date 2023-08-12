import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';
import UploadBtn from '@/components/UploadBtn';
import { ImageStruc } from '@/models/LayerStruc';
import { makeImage } from '@/utils/image';
import { fileToBase64 } from '@/utils/file';

import { SettingProps } from '../Setting';

interface ImageProps extends SettingProps<ImageStruc> {}

export default function Image(props: ImageProps) {
  const { model } = props;

  const handleChange = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = await fileToBase64(file);
    const { width, height } = await makeImage(url);
    model.replaceUrl(url, { width, height });
  };

  return (
    <SettingContainer title="图片">
      <LayerBaseSetting model={model} />

      <UploadBtn
        onChange={handleChange}
        btnTitle="替换图片"
        className="setting-row"
      />
    </SettingContainer>
  );
}
