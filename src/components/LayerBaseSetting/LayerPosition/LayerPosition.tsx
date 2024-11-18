import { useState, useMemo, useEffect } from 'react';
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
import { getOverlayLayers } from '@/utils/layers';
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
  const layers = activedScene?.layers || [];

  const [levelPopoverOpen, setLevelPopoverOpen] = useState(false);
  const [marks, setMarks] = useState<SliderMarks>({});
  /** 覆盖层 */
  const [overlayLayers, setOverlayLayers] = useState<LayerStrucType[]>([]);
  /** 活动图层索引 */
  const [activeMarkIndex, setActiveMarkIndex] = useState(MIN_MARK);

  /** 最大标记 */
  const maxMark = useMemo(
    () => Math.max(MIN_MARK, overlayLayers.length - 1),
    [overlayLayers]
  );

  const disableMoveUp = useMemo(
    () => activeMarkIndex >= maxMark,
    [activeMarkIndex, maxMark]
  );

  const disableMoveDown = useMemo(
    () => activeMarkIndex <= MIN_MARK,
    [activeMarkIndex]
  );

  const closePopover = () => {
    setLevelPopoverOpen(false);
  };

  const onFlipPopoverOpenChange = (open: boolean) => {
    const value = isLock ? false : open;
    value && initMarks();
    setLevelPopoverOpen(value);
  };

  const initMarks = () => {
    const list = getOverlayLayers(model, layers);
    const sliderMarks = list.reduce(
      (marks: SliderMarks, _item, index: number) => {
        const markList = { ...marks, [index]: { ...mark } };
        return markList;
      },
      {}
    );
    setOverlayLayers(list);
    setMarks(sliderMarks);
    const defaultActiveMark = list.findIndex(item => item.id === model.id);
    setActiveMarkIndex(defaultActiveMark);
  };

  const changeMark = (markIndex: number) => {
    changeLayers(markIndex);
    setActiveMarkIndex(markIndex);
  };

  /**
   *  调整层级
   * @param targetLayerId 活动图层调整位置的目标图层
   */
  const changeLayers = (markIndex: number) => {
    const target = overlayLayers[markIndex];
    if (!target) return;
    const targetIndex = target.getIndex();
    model.onMove(targetIndex);
    /** 调换layer位置 */
    setOverlayLayers(getOverlayLayers(model, layers));
  };

  const moveUp = () => {
    if (disableMoveUp) return;
    const markIndex = activeMarkIndex + 1;
    changeLayers(markIndex);
    setActiveMarkIndex(markIndex);
  };

  const moveDown = () => {
    if (disableMoveDown) return;
    const markIndex = activeMarkIndex - 1;
    changeLayers(markIndex);
    setActiveMarkIndex(markIndex);
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

  useEffect(() => {
    initMarks();
  }, [layers, model.x, model.y, model.width, model.height]);

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
            value={activeMarkIndex}
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
