import * as React from 'react';
import cls from 'classnames';

import { MagneticLineProps } from './props';
import { AxleDirection } from '../constants/AxleDirection';
import './MagneticLine.less';

export const prefixCls = 'magnetic-line';

const getLineStyle = (length: number, direction: 'x' | 'y') => {
  if (direction === AxleDirection.x) {
    return {
      width: length,
    };
  }
  return {
    height: length,
  };
};

export default function MagneticLine(props: MagneticLineProps) {
  const { lines } = props;

  if (!lines) return null;

  return (
    <>
      {lines.map((line, index) => {
        const { axis, length, direction } = line;

        return (
          <div
            className={prefixCls}
            style={{
              transform: `translate(${axis.x}px,${axis.y}px)`,
            }}
            key={`${direction}-${index}`}
          >
            <div
              style={getLineStyle(length, direction)}
              className={cls(`${prefixCls}-line`, {
                [`${prefixCls}-horizontal`]: direction === AxleDirection.x,
                [`${prefixCls}-vertical`]: direction === AxleDirection.y,
              })}
            />
          </div>
        );
      })}
    </>
  );
}
