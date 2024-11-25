import { CSSProperties, PropsWithChildren } from 'react';
/**
 * 组件基础属性
 */
export interface ComponentProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * 容器组件基础属性
 */
export type ContainerComponentProps = ComponentProps & PropsWithChildren;
