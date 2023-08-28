import { useState, useRef } from 'react';
import { observer } from 'mobx-react';
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
import { magic } from '@/store';
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

const MIN_MARK = 0;

function LayerPosition(props: LayerLevelProps) {
  const { model, className } = props;
  const { isLock } = model;
  const { activedScene } = magic;

  const [levelPopoverOpen, setLevelPopoverOpen] = useState(false);
  const [maxMark, setMaxMark] = useState(MIN_MARK);
  const [marks, setMarks] = useState<SliderMarks>({});
  const [activeMark, setActiveMark] = useState(MIN_MARK);

  const disableMoveUp = activeMark >= maxMark;
  const disableMoveDown = activeMark <= MIN_MARK;

  const overlayLayerRef = useRef<LayerStrucType[]>([]);

  const closePopover = () => {
    setLevelPopoverOpen(false);
  };

  const onFlipPopoverOpenChange = (open: boolean) => {
    const value = isLock ? false : open;
    value && initMarks();
    setLevelPopoverOpen(value);
  };

  const initMarks = () => {
    const list = magic.getOverlayLayer(model);
    const newMarks = list.reduce((marks: SliderMarks, _item, index: number) => {
      const markList = { ...marks, [index]: mark };
      return markList;
    }, {});
    setMarks(newMarks);
    setMaxMark(list.length - 1);
    const defaualActiveMark = list.findIndex(item => item.id === model.id);
    setActiveMark(defaualActiveMark);
    overlayLayerRef.current = list;
  };

  const changeMark = (mark: number) => {
    changeLayers(model, overlayLayerRef.current[mark]);
    setActiveMark(mark);
  };

  // todo: 替换两元素的位置，需要优化写法
  const changeLayers = (layer1: LayerStrucType, layer2: LayerStrucType) => {
    if (layer1.id === layer2.id) return;
    const layers = [...(activedScene?.layers || [])];
    /** 调换layer位置 */
    const index1ByLayers = layers.findIndex(item => item.id === layer1.id);
    const index2ByLayers = layers.findIndex(item => item.id === layer2.id);

    if (index1ByLayers > -1 && index2ByLayers > -1) {
      layers[index1ByLayers] = layer2;
      layers[index2ByLayers] = layer1;
      activedScene?.update({ layers });
      overlayLayerRef.current = magic.getOverlayLayer(model);
    }
  };

  const moveUp = () => {
    if (disableMoveUp) return;

    changeLayers(
      overlayLayerRef.current[activeMark],
      overlayLayerRef.current[activeMark + 1]
    );

    setActiveMark(activeMark + 1);
  };

  const moveDown = () => {
    if (disableMoveDown) return;

    changeLayers(
      overlayLayerRef.current[activeMark],
      overlayLayerRef.current[activeMark - 1]
    );

    setActiveMark(activeMark - 1);
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
          <Tooltip title="下移">
            <VerticalLeftOutlined
              onClick={moveDown}
              className={cls(Style.ratote90, Style.layer_level_icon, {
                [Style.disable_layer_level_icon]: disableMoveDown,
              })}
            />
          </Tooltip>

          <Slider
            value={activeMark}
            onChange={changeMark}
            tooltip={{ open: false }}
            className={Style.slider}
            marks={marks}
            min={MIN_MARK}
            max={maxMark}
          />

          <Tooltip title="上移">
            <VerticalLeftOutlined
              onClick={moveUp}
              className={cls(Style.ratote_flip90, Style.layer_level_icon, {
                [Style.disable_layer_level_icon]: disableMoveUp,
              })}
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

export default observer(LayerPosition);
