import { useMemo } from 'react';
import { observer } from 'mobx-react';
import cls from 'classnames';
import { Button, ColorPicker } from 'antd';
import { Color } from 'antd/es/color-picker';
import SettingContainer from '@/components/SettingContainer';
// import { BackgroundStruc } from '@/models/LayerStruc';
// import { SettingProps } from '../Setting';
import { magic } from '@/store';
import Style from './Canvas.module.less';
import { BackColorList } from '@/config/ColorList';
import { BackgroundStruc } from '@/models/LayerStruc';

// interface CanvasProps extends SettingProps<BackgroundStruc | null> {}

function Canvas() {
  const { activedScene } = magic;

  if (!activedScene) return null;

  const { width, height, backgroundLayer } = activedScene;

  const colorValue = useMemo(() => {
    if (!backgroundLayer) return '';
    const { fillType, color } = backgroundLayer;
    if (fillType === 'Color') return color;
    return '';
  }, [backgroundLayer.color, backgroundLayer.fillType]);

  const onChangeColor = (color: Color) => {
    backgroundLayer.update<Partial<BackgroundStruc>>({
      fillType: 'Color',
      color: color.toRgbString(),
    });
  };

  return (
    <SettingContainer title="画布">
      <div>
        <div className={cls('title-text', 'setting-row', Style.row_layout)}>
          <div>画布尺寸</div>
          <div>
            {width} x {height} px
          </div>
        </div>

        <Button className={cls('setting-row')} block>
          调整尺寸
        </Button>
      </div>

      <div
        className={cls('setting-row', Style.row_layout, Style.background_color)}
      >
        <div className={cls('title-text')}>背景色</div>
        <ColorPicker
          value={colorValue}
          onChange={onChangeColor}
          presets={[{ label: '预设颜色', colors: BackColorList }]}
        />
      </div>
    </SettingContainer>
  );
}

export default observer(Canvas);
