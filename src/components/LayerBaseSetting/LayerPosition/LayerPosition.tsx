import { useState } from 'react';
import { Popover, Slider, Tooltip } from 'antd';
import {
  AimOutlined,
  CloseOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  VerticalLeftOutlined,
} from '@ant-design/icons';
import cls from 'classnames';
import { SliderMarks } from 'antd/es/slider';
import { LayerStrucType } from '@/types/model';
import Style from './LayerPosition.module.less';

interface LayerLevelProps {
  model: LayerStrucType;
  className: string;
}

const mark = {
  style: {
    marginTop: '5px',
    width: '1px',
    height: '6px',
    background: '#b4b8bf',
  },

  label: <div />,
};

const marks: SliderMarks = {
  1: mark,
  2: mark,
  3: mark,
};

export default function LayerPosition(props: LayerLevelProps) {
  const { model, className } = props;

  const [levelPopoverOpen, setLevelPopoverOpen] = useState(false);

  const closePopover = () => {
    setLevelPopoverOpen(false);
  };

  const onFlipPopoverOpenChange = (open: boolean) => {
    const value = model.isLock ? false : open;
    setLevelPopoverOpen(value);
  };

  const toTop = () => {
    model.toTopInCanvas();
  };

  const toLeft = () => {
    model.toLeftInCanvas();
  };

  const toBottom = () => {
    model.toBottomInCanvas();
  };

  const toRight = () => {
    model.toRightInCanvas();
  };

  const toVerticalCenterAlign = () => {
    model.toVerticalCenterAlignInCanvas();
  };

  const toHorizontalCenterAlign = () => {
    model.toHorizontalCenterAlignInCanvas();
  };

  const toCenterAlign = () => {
    model.toCenterAlignInCanvas();
  };

  const popoverContent = (
    <div className={Style.popover_content}>
      <div className={Style.header}>
        <span>图层位置</span>
        <CloseOutlined className={Style.close_icon} onClick={closePopover} />
      </div>

      <div className={Style.body}>
        <div className={Style.btn_box}>
          <div onClick={toHorizontalCenterAlign} className={Style.btn}>
            水平居中
          </div>
          <div onClick={toVerticalCenterAlign} className={Style.btn}>
            垂直居中
          </div>
        </div>

        <div className={Style.edit_control}>
          <Tooltip title="贴顶部">
            <VerticalAlignTopOutlined
              className={Style.edit_item}
              onClick={toTop}
            />
          </Tooltip>
          <div>
            <Tooltip title="贴左侧" placement="left">
              <VerticalAlignTopOutlined
                onClick={toLeft}
                className={cls(Style.edit_item, Style.ratote_flip90)}
              />
            </Tooltip>
            <Tooltip title="画布中心">
              <AimOutlined
                onClick={toCenterAlign}
                className={cls(Style.edit_item, Style.center)}
              />
            </Tooltip>

            <Tooltip title="贴右侧" placement="right">
              <VerticalAlignTopOutlined
                onClick={toRight}
                className={cls(Style.edit_item, Style.ratote90)}
              />
            </Tooltip>
          </div>

          <Tooltip title="贴底部" placement="bottom">
            <VerticalAlignBottomOutlined
              onClick={toBottom}
              className={Style.edit_item}
            />
          </Tooltip>
        </div>

        <div className={Style.layer_level_title}>图层顺序</div>

        <div className={Style.layer_level_wrapper}>
          <Tooltip title="上移">
            <VerticalLeftOutlined
              className={cls(Style.ratote_flip90, Style.layer_level_icon)}
            />
          </Tooltip>
          <Slider
            tooltip={{ open: false }}
            className={Style.slider}
            marks={marks}
            min={1}
            max={3}
          />

          <Tooltip title="下移">
            <VerticalLeftOutlined
              className={cls(Style.ratote90, Style.layer_level_icon)}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      overlayClassName={Style.popover_layer_level}
      title={popoverContent}
      open={levelPopoverOpen}
      placement="bottomLeft"
      trigger="click"
      onOpenChange={onFlipPopoverOpenChange}
    >
      <i className={cls('iconfont icon-left-layer', className)} />
    </Popover>
  );
}
