import { observer } from 'mobx-react';
import { MagneticLine, MagneticLineType } from '@p/EditorTools';
import EditorControl from './EditorControl';
import { LayerStrucType } from '@/types/model';
import Style from './Editor.module.less';

interface EditorProps {
  isMultiple?: boolean;
  zoomLevel?: number;
  activedLayers: LayerStrucType[];
  magneticLines?: MagneticLineType[] | null;
}

function Editor(props: EditorProps) {
  const { isMultiple, activedLayers, zoomLevel, magneticLines } = props;

  const getEditorControl = () => {
    if (activedLayers.length === 0) return null;

    if (isMultiple) {
      return <div>多选框</div>;
    }

    return <EditorControl zoomLevel={zoomLevel} model={activedLayers[0]} />;
  };

  return (
    <div
      className={Style.editor}
      onMouseDown={e => {
        e.stopPropagation();
      }}
    >
      {getEditorControl()}

      <MagneticLine lines={magneticLines} />
    </div>
  );
}

export default observer(Editor);
