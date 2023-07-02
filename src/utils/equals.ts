/**
 * 对比两个对象全等
 * @param a 对比项
 * @param b 被对比项
 * @returns {boolean}
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
function isEqualsObject(a: Record<string, any>, b: Record<string, any>) {
  const keys1 = Object.keys(a);
  const keys2 = Object.keys(b);
  let len1 = keys1.length;

  if (len1 !== keys2.length) return false;

  while ((len1 -= 1)) {
    const key = keys1[len1];
    if (!isEquals(a[key], b[key])) return false;
  }

  if (
    'constructor' in a &&
    'constructor' in b &&
    a.constructor !== b.constructor
  ) {
    return false;
  }

  return true;
}

function isEqualsArray(a: any[], b: any[]) {
  if (a.length !== b.length) return false;
  let len = a.length;
  while ((len -= 1)) {
    if (!isEquals(a[len], b[len])) return false;
  }
  return true;
}

function isEqualsMap(a: Map<any, any>, b: Map<any, any>) {
  if (a.size !== b.size) return false;
  for (const key of a.keys()) {
    if (!isEquals(a.get(key), b.get(key))) return false;
  }
  return true;
}

function isEqualsSet(a: Set<any>, b: Set<any>) {
  if (a.size !== b.size) return false;
  const arr = Array.from(b);
  for (const v1 of a.values()) {
    let found = false;
    for (let i = 0; i < arr.length; i += 1) {
      if (isEquals(v1, arr[i])) {
        found = true;
        arr.splice(i, 1);
        break;
      }
    }
    if (!found) return false;
  }
  return true;
}

function isEqualsByTag(a: any, b: any, tag: string) {
  switch (tag) {
    case '[object Boolean]':
    case '[object Number]':
    case '[object Date]': {
      const v1 = +a;
      const v2 = +b;
      return v1 === v2;
    }
    case '[object String]':
    case '[object RegExp]': {
      return a === `${b}`;
    }
    case '[object Symbol]': {
      const { valueOf } = Symbol.prototype;
      return valueOf.call(a) === valueOf.call(b);
    }
    case '[object Map]': {
      return isEqualsMap(a, b);
    }
    case '[object Set]': {
      return isEqualsSet(a, b);
    }
    default:
      break;
  }
  return false;
}

export default function isEquals(a: any, b: any) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;

  const tag1 = Object.prototype.toString.call(a);
  const tag2 = Object.prototype.toString.call(b);

  if (tag1 !== tag2) return false;

  if (tag1 !== '[object Array]' && tag1 !== '[object Object]') {
    return isEqualsByTag(a, b, tag1);
  }

  return Array.isArray(a) ? isEqualsArray(a, b) : isEqualsObject(a, b);
}
