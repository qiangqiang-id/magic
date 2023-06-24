import Style from './Text.module.less';

export default function Text() {
  const addTitle = () => {
    console.log('添加标题');
  };

  const addText = () => {
    console.log('添加正文');
  };

  return (
    <div className={Style.text}>
      <div className={Style.text_item} onClick={addTitle}>
        标题
      </div>
      <div className={Style.text_item} onClick={addText}>
        正文
      </div>
    </div>
  );
}
