type AnyObject = { [key: string]: any };

function isObject(obj: any): obj is AnyObject {
  return obj !== null && typeof obj === 'object';
}

export function deepMerge(target: AnyObject, source: AnyObject): AnyObject {
  const output = { ...target };

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      continue;
    }

    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      output[key] = [...targetValue, ...sourceValue];
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  }

  return output;
}
