import cls from 'classnames';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';
import Upload from '@/components/Upload';
import { ImageStruc } from '@/models/LayerStruc';
import { makeImage } from '@/utils/image';
import { fileToBase64 } from '@/utils/file';
import { magic } from '@/store';

import { SettingProps } from '../Setting';

import Style from './Image.module.less';

interface ImageProps extends SettingProps<ImageStruc> {}

function Image(props: ImageProps) {
  const { model } = props;
  const { isOpenImageCrop } = magic;

  const handleChange = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = await fileToBase64(file);
    const { width, height } = await makeImage(url);
    model.replaceUrl(url, { width, height });
  };

  const onCrop = () => {
    if (model.isLock) return;
    isOpenImageCrop ? magic.closeImageCrop() : magic.openImageCrop();
  };

  return (
    <SettingContainer title="图片">
      <Upload accept={['image/*']} onChange={handleChange}>
        <Button type="primary" block className={cls('setting-row')}>
          替换图片
        </Button>
      </Upload>

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

      <LayerBaseSetting model={model} />
    </SettingContainer>
  );
}

export default observer(Image);
