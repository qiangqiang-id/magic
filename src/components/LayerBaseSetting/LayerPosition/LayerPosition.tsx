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

  const overlayLayersRef = useRef<LayerStrucType[]>([]);

  const closePopover = () => {
    setLevelPopoverOpen(false);
  };

  const onFlipPopoverOpenChange = (open: boolean) => {
    const value = isLock ? false : open;
    value && initMarks();
    setLevelPopoverOpen(value);
  };

  const initMarks = () => {
    const list = magic.getOverlayLayers(model);
    const sliderMarks = list.reduce(
      (marks: SliderMarks, _item, index: number) => {
        const markList = { ...marks, [index]: { ...mark } };
        return markList;
      },
      {}
    );
    setMarks(sliderMarks);
    setMaxMark(list.length - 1);
    const defaualActiveMark = list.findIndex(item => item.id === model.id);
    setActiveMark(defaualActiveMark);
    overlayLayersRef.current = list;
  };

  const changeMark = (mark: number) => {
    changeLayers(overlayLayersRef.current[mark].id);
    setActiveMark(mark);
  };

  /**
   *  调整层级
   * @param targetLayerId 活动图层调整位置的目标图层
   * @returns
   */
  const changeLayers = (targetLayerId: string) => {
    const activeLayerId = model.id;
    if (!activeLayerId || !targetLayerId || activeLayerId === targetLayerId)
      return;

    const layers = activedScene?.layers;
    /** 调换layer位置 */
    const activeLayerByLayers = layers?.find(item => item.id === activeLayerId);
    const targetLayerByLayers = layers?.find(item => item.id === targetLayerId);
    if (activeLayerByLayers && targetLayerByLayers) {
      /**
       * 如果活动图层的位置大于 目标图层的位置，说明为向下调整，小于则取反。
       */
      if (activeLayerByLayers.getIndex() > targetLayerByLayers.getIndex()) {
        model.toDown(targetLayerByLayers);
      } else {
        model.toUp(targetLayerByLayers);
      }
    }
    overlayLayersRef.current = magic.getOverlayLayers(model);
  };

  const moveUp = () => {
    if (disableMoveUp) return;
    const mark = activeMark + 1;
    changeLayers(overlayLayersRef.current[mark].id);
    setActiveMark(mark);
  };

  const moveDown = () => {
    if (disableMoveDown) return;
    const mark = activeMark - 1;
    changeLayers(overlayLayersRef.current[mark].id);
    setActiveMark(mark);
  };

  const toTop = () => {
    model.toTopInCanvas();
    initMarks();
  };

  const toLeft = () => {
    model.toLeftInCanvas();
    initMarks();
  };

  const toBottom = () => {
    model.toBottomInCanvas();
    initMarks();
  };

  const toRight = () => {
    model.toRightInCanvas();
    initMarks();
  };

  const toVerticalCenterAlign = () => {
    model.toVerticalCenterAlignInCanvas();
    initMarks();
  };

  const toHorizontalCenterAlign = () => {
    model.toHorizontalCenterAlignInCanvas();
    initMarks();
  };

  const toCenterAlign = () => {
    model.toCenterAlignInCanvas();
    initMarks();
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
