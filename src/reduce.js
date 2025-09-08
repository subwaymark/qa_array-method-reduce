'use strict';

/**
 * @param {function} callback
 * @param {*} startValue
 *
 * @returns {*}
 */
function reduce(callback, startValue) {
  const isArrayLike = !Array.isArray(this);
  const keys = isArrayLike
    ? Object.keys(this).slice(0, this.length)
    : Object.keys(this);
  const doThrowError = this.length < 1 && startValue === undefined;
  let prev = startValue;
  let i2 = 0;
  let valueIndex = +keys[i2];

  if (doThrowError) {
    throw new TypeError(`Array doesn't have any element`);
  }

  if (arguments.length < 2) {
    i2 = 1;
    valueIndex = +keys[i2]; // Pierwszy nie-pusty element
    prev = this[keys[0]];

    for (let i = 0; i < keys.length - 1; i++, i2++) {
      prev = callback(prev, this[valueIndex], valueIndex, this);
      valueIndex = +keys[i2 + 1];
    }

    return prev;
  }

  for (let i = 0; i < keys.length; i++, i2++) {
    prev = callback(prev, this[valueIndex], valueIndex, this);
    valueIndex = +keys[i2 + 1];
  }

  return prev;
}

module.exports = { reduce };
