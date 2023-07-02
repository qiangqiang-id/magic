import { EditorBox } from '@p/EditorTools';
import Style from './Editor.module.less';

interface EditorProps {
  zoomLevel?: number;
}

export default function Editor(props: EditorProps) {
  console.log('props', props);
  return (
    <div className={Style.editor}>
      <EditorBox />
    </div>
  );
}
