import { OBB } from '@/helpers/Obb';

/**
 * 检测两矩形是否发生碰撞
 **/
export function isCollision(rect1: OBB, rect2: OBB) {
  const nv = rect1.centerPoint.sub(rect2.centerPoint);
  const axisA1 = rect1.axes[0];
  if (
    rect1.getProjectionRadius(axisA1) + rect2.getProjectionRadius(axisA1) <=
    Math.abs(nv.dot(axisA1))
  )
    return false;

  const axisA2 = rect1.axes[1];
  if (
    rect1.getProjectionRadius(axisA2) + rect2.getProjectionRadius(axisA2) <=
    Math.abs(nv.dot(axisA2))
  )
    return false;

  const axisB1 = rect2.axes[0];
  if (
    rect1.getProjectionRadius(axisB1) + rect2.getProjectionRadius(axisB1) <=
    Math.abs(nv.dot(axisB1))
  )
    return false;

  const axisB2 = rect2.axes[1];
  if (
    rect1.getProjectionRadius(axisB2) + rect2.getProjectionRadius(axisB2) <=
    Math.abs(nv.dot(axisB2))
  )
    return false;
  return true;
}
