import { ReactNode } from 'react';
import UploadBtn from '@/components/UploadBtn';
import { BACK_COLOR_LIST } from '@/constants/ColorList';
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

export default function Back() {
  const addBackImage = (files: File[]) => {
    console.log(files);
  };

  const addBackColor = (color: string) => {
    console.log(color);
  };

  return (
    <div>
      <BackContent title="预设颜色">
        <ul className={Style.color_wrapper}>
          {BACK_COLOR_LIST.map(color => (
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
