import Style from './Editor.module.less';

interface EditorProps {
  zoomLevel?: number;
}

export default function Editor(props: EditorProps) {
  console.log(props);

  return <div className={Style.editor} />;
}
