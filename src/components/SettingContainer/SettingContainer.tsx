import Style from './SettingContainer.module.less';

interface SettingContainerProps {
  title: string;
  children?: React.ReactElement[] | React.ReactElement;
}

export default function SettingContainer(props: SettingContainerProps) {
  const { title, children } = props;
  return (
    <div className={Style.setting_container}>
      <div className={Style.title}>{title}</div>
      <div className={Style.content}>{children}</div>
    </div>
  );
}
