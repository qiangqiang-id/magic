import cls from 'classnames';
import { observer } from 'mobx-react';
import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';
import UploadBtn from '@/components/UploadBtn';
import { ImageStruc } from '@/models/LayerStruc';
import { makeImage } from '@/utils/image';
import { fileToBase64 } from '@/utils/file';
import { setting } from '@/store';

import { SettingProps } from '../Setting';

import Style from './Image.module.less';

interface ImageProps extends SettingProps<ImageStruc> {}

function Image(props: ImageProps) {
  const { model } = props;
  const { isOpenImageCrop } = setting;

  const handleChange = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = await fileToBase64(file);
    const { width, height } = await makeImage(url);
    model.replaceUrl(url, { width, height });
  };

  const onCrop = () => {
    if (model.isLock) return;
    isOpenImageCrop ? setting.closeImageCrop() : setting.openImageCrop();
  };

  return (
    <SettingContainer title="图片">
      <LayerBaseSetting model={model} />

      <UploadBtn
        onChange={handleChange}
        btnTitle="替换图片"
        className={cls('setting-row', Style.replace_image_btn)}
      />

      <div className={Style.feature_wrapper}>
        <div>
          <div
            className={cls(Style.feature_item, {
              locked: model.isLock,
            })}
            onClick={onCrop}
            onMouseDown={e => e.stopPropagation()}
          >
            <i
              className={cls('iconfont icon-image-crop', Style.feature_icon)}
            />
            <span className={Style.feature_name}>裁剪</span>
          </div>
        </div>
      </div>
    </SettingContainer>
  );
}

export default observer(Image);
