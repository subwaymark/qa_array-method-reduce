'use strict';

/**
 * @param {function} callback
 * @param {*} startValue
 *
 * @returns {*}
 */
function reduce(callback, startValue) {
  if (typeof callback !== 'function') {
    throw new TypeError('Callback is not a function');
  }

  const copyOfThis = { ...this };
  const isArrayLike = this instanceof Object
    && this.hasOwnProperty('length')
    && typeof this.length === 'number'
    && !Array.isArray(this);

  Object.defineProperty(copyOfThis, 'length', {
    value: this.length,
    enumerable: false,
  });

  const len = copyOfThis.length >>> 0;
  const hasStartValue = arguments.length >= 2;

  if (len < 1 && !hasStartValue) {
    // eslint-disable-next-line max-len
    throw new TypeError(`Array is empty and doesn't have 'startValue' argument`);
  }

  let prev = startValue;
  let start = 0;

  if (!hasStartValue) {
    for (let i = 0; i < len; i++) {
      if (i in copyOfThis) {
        prev = copyOfThis[i];
        start = i + 1;
        break;
      } else if (i === len) {
        throw new TypeError(`Index hasn't been founded`);
      }
    }
  }

  for (let i = start; i < len; i++) {
    if (!(i in copyOfThis)) {
      continue;
    }

    if (!isArrayLike) {
      const copyOfThisArr = Object.assign([], copyOfThis);

      prev = callback(prev, copyOfThis[i], i, copyOfThisArr);
      continue;
    }

    prev = callback(prev, copyOfThis[i], i, copyOfThis);
  }

  return prev;
}

module.exports = { reduce };
