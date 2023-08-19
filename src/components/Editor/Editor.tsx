import { observer } from 'mobx-react';
import cls from 'classnames';
import { MagneticLine, MagneticLineType } from '@p/EditorTools';
import EditorControl from './EditorControl';
import { LayerStrucType } from '@/types/model';
import Hover from './Hover';
import RichText from './RichText';
import { TextStruc } from '@/models/LayerStruc';
import { setting } from '@/store';
import Style from './Editor.module.less';

interface EditorProps {
  isMultiple?: boolean;
  zoomLevel?: number;
  activedLayers: LayerStrucType[];
  magneticLines?: MagneticLineType[] | null;
}

function Editor(props: EditorProps) {
  const {
    isMultiple = false,
    activedLayers,
    zoomLevel = 1,
    magneticLines,
  } = props;

  const model = activedLayers[0];

  const getEditorControl = () => {
    if (activedLayers.length === 0) return null;

    if (isMultiple) {
      return <div>多选框</div>;
    }

    return <EditorControl zoomLevel={zoomLevel} model={activedLayers[0]} />;
  };

  return (
    <div
      className={cls(Style.editor, {
        [Style.hidden]: setting.isOpenImageCrop,
      })}
      onMouseDown={e => {
        e.stopPropagation();
      }}
    >
      {/* 编辑框 */}
      {getEditorControl()}

      {/* hover 框 */}
      <Hover />

      {/* 磁力线 */}
      <MagneticLine lines={magneticLines} />

      {/* 富文本 */}
      {model?.isText && (
        <RichText
          zoomLevel={zoomLevel}
          isMultiple={isMultiple}
          model={model as TextStruc}
        />
      )}
    </div>
  );
}

export default observer(Editor);
