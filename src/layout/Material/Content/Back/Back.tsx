import { ReactNode } from 'react';
import { observer } from 'mobx-react';
import UploadBtn from '@/components/UploadBtn';
import { BackColorList } from '@/config/ColorList';
import { fileToBase64 } from '@/utils/file';
import { useStores } from '@/store';
import Style from './Back.module.less';

interface BackContentProps {
  title: string;
  children: ReactNode;
  className?: string;
}

function BackContent(props: BackContentProps) {
  const { title, children, className } = props;

  return (
    <div className={className}>
      <div className={Style.title}>{title}</div>
      {children}
    </div>
  );
}

function Back() {
  const { magic } = useStores();

  const { activedScene } = magic;

  const addBackImage = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const dataUrl = await fileToBase64(file);
    activedScene?.setSceneBack({ fillType: 'Image', url: dataUrl });
  };

  const addBackColor = (color: string) => {
    activedScene?.setSceneBack({ fillType: 'Color', color });
  };

  return (
    <div>
      <BackContent title="预设颜色">
        <ul className={Style.color_wrapper}>
          {BackColorList.map(color => (
            <li
              className={Style.color_item}
              key={color}
              style={{
                background: color,
              }}
              onClick={() => addBackColor(color)}
            />
          ))}
        </ul>
      </BackContent>

      <BackContent className={Style.picture_wrapper} title="图片背景">
        <UploadBtn onChange={addBackImage} btnTitle="添加图片背景" />
      </BackContent>
    </div>
  );
}

export default observer(Back);
