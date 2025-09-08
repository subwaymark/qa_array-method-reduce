'use strict';

const { reduce } = require('./reduce');

describe('reduce function', () => {
  const callbacks = [
    jest.fn((total, currentValue, currentIndex, arr) => {
      return total + currentValue;
    }),
    jest.fn((total, currentValue, currentIndex, arr) => {
      return total - currentValue;
    }),
    jest.fn((total, currentValue, currentIndex, arr) => {
      return total * currentValue;
    }),
    jest.fn((total, currentValue, currentIndex, arr) => {
      return (total + currentValue) / 2;
    }),
  ];

  const [adding, subtracting, multiplication, average] = callbacks;

  beforeAll(() => {
    Array.prototype.reduce2 = reduce; // eslint-disable-line
  });

  beforeEach(() => {
    adding.mockClear();
    subtracting.mockClear();
    multiplication.mockClear();
    average.mockClear();
  });

  afterAll(() => {
    delete Array.prototype.reduce2;
  });

  it(`should use 'startValue' argument as first element of array `
      + `if 'startValue' argument is included`, () => {
    [1, 5, 4].reduce2(adding, 8);
    [5, 3, 2].reduce2(subtracting, 20);
    [2, 2.5].reduce2(multiplication, 2);
    [0, 30, 0].reduce2(average, 20);

    const listOfStartValue = [
      adding.mock.calls[0][0],
      subtracting.mock.calls[0][0],
      multiplication.mock.calls[0][0],
      average.mock.calls[0][0],
    ];

    const expected = [8, 20, 2, 20];

    listOfStartValue.forEach((result, i) => {
      expect(result)
        .toBe(expected[i]);
    });
  });

  it(`should invoke first callback with argument `
      + `'total' = first element of array `
      + `when 'startValue' argument isn't included`, () => {
    [1, 5, 4].reduce2(adding);
    [5, 3, 2].reduce2(subtracting);
    [2, 2.5].reduce2(multiplication);
    [0, 30, 0].reduce2(average);

    const listOfStartValue = [
      adding.mock.calls[0][0],
      subtracting.mock.calls[0][0],
      multiplication.mock.calls[0][0],
      average.mock.calls[0][0],
    ];

    const expected = [1, 5, 2, 0];

    listOfStartValue.forEach((result, i) => {
      expect(result)
        .toBe(expected[i]);
    });
  });

  it(`should invoke 2nd, 3rd, 4th... callback function with 'total' `
      + `'total' argument = previously returned value from callback  `, () => {
    const array1 = [1, 5, 4];
    const array2 = [5, 3, 2];
    const array3 = [2, 2.5];
    const array4 = [0, 30, 0];

    array1.reduce2(adding);
    array2.reduce2(subtracting, 20);
    array3.reduce2(multiplication, 2);
    array4.reduce2(average);

    const listOfArguments = [
      adding.mock.calls,
      subtracting.mock.calls,
      multiplication.mock.calls,
      average.mock.calls,
    ];

    const expected = [
      [1, 6],
      [20, 15, 12],
      [2, 4],
      [0, 15],
    ];

    listOfArguments.forEach((argList, operationIndex) => {
      argList.forEach((call, callIndex) => {
        const total = call[0];

        expect(total)
          .toBe(expected[operationIndex][callIndex]);
      });
    });
  });

  it(`should invoke callback function `
      + `with 'currentValue' argument `, () => {
    [1, 5, 4].reduce2(adding, 8);
    [5, 3, 2].reduce2(subtracting, 20);
    [2, 2.5].reduce2(multiplication, 2);
    [0, 30, 0].reduce2(average, 20);

    const listOfArguments = [
      adding.mock.calls,
      subtracting.mock.calls,
      multiplication.mock.calls,
      average.mock.calls,
    ];

    const expected = [
      [1, 5, 4],
      [5, 3, 2],
      [2, 2.5],
      [0, 30, 0],
    ];

    listOfArguments.forEach((argList, operationIndex) => {
      argList.forEach((call, callIndex) => {
        const currentVal = call[1];

        expect(currentVal)
          .toBe(expected[operationIndex][callIndex]);
      });
    });
  });

  it(`should invoke callback function first time with argument `
      + `'index' = 0 if 'startValue' included `
      + `'index' = 1 if 'startValue isn't included' `, () => {
    [1, 5].reduce2(adding);
    [5, 3].reduce2(subtracting);
    [2, 2.5].reduce2(multiplication, 2);
    [0, 30, 0].reduce2(average, 20);

    const listOfArguments = [
      adding.mock.calls,
      subtracting.mock.calls,
      multiplication.mock.calls,
      average.mock.calls,
    ];

    const expected = [
      [1],
      [1],
      [0, 1],
      [0, 1, 2, 3],
    ];

    listOfArguments.forEach((argList, operationIndex) => {
      argList.forEach((call, callIndex) => {
        const currentIndex = call[2];

        expect(currentIndex)
          .toBe(expected[operationIndex][callIndex]);
      });
    });
  });

  it(`should invoke callback function `
      + `with 'index' argument `, () => {
    [1, 5, 4].reduce2(adding);
    [5, 3, 2].reduce2(subtracting);
    [2, 2.5].reduce2(multiplication, 2);
    [0, 30, 0].reduce2(average, 20);

    const listOfArguments = [
      adding.mock.calls,
      subtracting.mock.calls,
      multiplication.mock.calls,
      average.mock.calls,
    ];

    const expected = [
      [1, 2],
      [1, 2],
      [0, 1, 2],
      [0, 1, 2, 3],
    ];

    listOfArguments.forEach((argList, operationIndex) => {
      argList.forEach((call, callIndex) => {
        const currentIndex = call[2];

        expect(currentIndex)
          .toBe(expected[operationIndex][callIndex]);
      });
    });
  });

  it(`should invoke callback function `
      + `with 'arr' argument === this `, () => {
    const array1 = [1, 5, 4];
    const array2 = [5, 3, 2];
    const array3 = [2, 2.5];
    const array4 = [0, 30, 0];

    array1.reduce2(adding, 8);
    array2.reduce2(subtracting, 20);
    array3.reduce2(multiplication, 2);
    array4.reduce2(average);

    const listOfArguments = [
      adding.mock.calls,
      subtracting.mock.calls,
      multiplication.mock.calls,
      average.mock.calls,
    ];

    const expected = [
      [array1, array1, array1, array1],
      [array2, array2, array2, array2],
      [array3, array3, array3],
      [array4, array4],
    ];

    listOfArguments.forEach((argList, operationIndex) => {
      argList.forEach((call, callIndex) => {
        const currentVal = call[3];

        expect(currentVal)
          .toBe(expected[operationIndex][callIndex]);
      });
    });
  });

  it(`should return single value: the function's accumulated result `, () => {
    const value = [
      [1, 5, 4],
      [5, 3, 2],
      [2, 2.5],
      [0, 30, 0],
    ];
    const startValue = [0, 20, 2, 20];

    value.forEach((array, i) => {
      const accumulatedResult = array.reduce2(callbacks[i], startValue[i]);

      expect(accumulatedResult)
        .toBe(10);
    });
  });

  it(`shouldn't change orginal array `, () => {
    const array1 = [1, 5, 4];
    const array2 = [5, 3, 2];
    const array3 = [2, 2.5];
    const array4 = [0, 30, 0];
    const allArray = [
      array1,
      array2,
      array3,
      array4,
    ];

    Object.defineProperty(array1, 'id', {
      value: 'Autentic',
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(array2, 'id', {
      value: 'Autentic',
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(array3, 'id', {
      value: 'Autentic',
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(array4, 'id', {
      value: 'Autentic',
      writable: false,
      enumerable: false,
      configurable: false,
    });

    const arraysClone = [[...array1], [...array2], [...array3], [...array4]];

    array1.reduce2(adding, 8);
    array2.reduce2(subtracting, 20);
    array3.reduce2(multiplication, 2);
    array4.reduce2(average);

    allArray.forEach((array, i) => {
      expect(array)
        .toEqual(arraysClone[i]);

      expect(array.id)
        .toBe('Autentic');
    });
  });

  it(`shouldn't execute callback when `
      + `array isn't included`, () => {
    const array1 = [];
    const array2 = [];
    const array3 = [];

    array1.reduce2(adding, 8);
    array2.reduce2(subtracting, 20);
    array3.reduce2(multiplication, 2);

    expect(adding.mock.calls.length)
      .toBe(0);

    expect(subtracting.mock.calls.length)
      .toBe(0);

    expect(multiplication.mock.calls.length)
      .toBe(0);
  });

  it(`should return single value when `
      + `array length = 0 and 'startValue' is included or `
      + `array length = 1 and 'startValue isn't included'`, () => {
    const results = [
      [6].reduce2(adding),
      [].reduce2(subtracting, 13),
      [24].reduce2(multiplication),
      [].reduce2(average, 91),
    ];
    const expected = [6, 13, 24, 91];

    results.forEach((result, i) => {
      expect(result)
        .toBe(expected[i]);
    });
  });

  it(`should throw TypeError when array is empty `
      + `and 'startValue' argument isn't included `, () => {
    const arrays = [
      [],
      [],
      [],
    ];

    arrays.forEach((array, i) => {
      expect(() => {
        array.reduce2(adding);
      }).toThrow(TypeError);
    });
  });

  it(`should work with diffrent types of prmitive data `, () => {
    const value = [
      ['This ', 'is ', 5],
      [true, 3, true],
      [null, undefined, 'Yes!'],
    ];

    const result1 = value[0].reduce2(adding);
    const result2 = value[1].reduce2(subtracting);
    const result3 = value[2].reduce2((total, current) => `This is: ${total}.`);

    expect(result1)
      .toBe('This is 5');

    expect(result2)
      .toBe(-3);

    expect(result3)
      .toBe('This is: This is: null..');
  });

  it(`shouldn't throw error when non-all arguments are included `
      + 'or no argument are included', () => {
    const array1 = [1, 5, 4];
    const array2 = [5, 3, 2];
    const array3 = [2, 2.5];
    const array4 = [0, 30, 0];

    const adding1 = jest.fn((total, currentValue, currentIndex) => {
      return total + currentValue;
    });
    const subtracting1 = jest.fn((total, currentValue) => {
      return total - currentValue;
    });
    const nothingSpecial = jest.fn((total) => {
      return total;
    });
    const nothingSpecial2 = jest.fn(() => {
      return 'Ups';
    });

    expect(() => {
      array1.reduce2(adding1);
      array2.reduce2(subtracting1, 20);
      array3.reduce2(nothingSpecial, 2);
      array4.reduce2(nothingSpecial2);
    }).not.toThrowError();
  });

  it(`should throw TypeError when 'callback' argument `
      + 'is not a function', () => {
    const arrays = [
      [1, 5, 4],
      [5, 3, 2],
      [2, 2.5],
      [0, 30, 0],
      [8, 43, 3],
    ];
    const nonFunction = [
      undefined,
      [],
      {},
      null,
      78,
    ];

    arrays.forEach((array, i) => {
      expect(() => {
        array.reduce2(nonFunction[i]);
      }).toThrow(TypeError);
    });
  });

  describe('(Sparse array)', () => {
    it('should skips non-existent indices '
      + 'e.g [5, , , 5, 4]', () => {
      const arrays = [
        /* eslint-disable max-len */
        /* eslint-disable no-sparse-arrays, standard/array-bracket-even-spacing, max-len */
        [, , 2, 17],
        [1, 1, , 4],
        [4, 5, 3, 1, , , , ],
        /* eslint-enable no-sparse-arrays, standard/array-bracket-even-spacing, max-len */
        /* eslint-enable max-len */
      ];
      const expected = [
        [3],
        [1, 3],
        [1, 2, 3],
      ];

      arrays.forEach((array, arrayIndex) => {
        array.reduce2(callbacks[arrayIndex]);

        const listOfArguments = callbacks[arrayIndex].mock.calls;

        for (let i = 0; i < listOfArguments.length; i++) {
          const index = listOfArguments[i][2];

          expect(index)
            .toBe(expected[arrayIndex][i]);
        }
      });
    }
    );
  });

  describe('(Array-like object)', () => {
    it(`should work with array like object `, () => {
      const artificialObject = { 'reduce2': reduce };

      const array1 = Object.create(artificialObject, {
        0: {
          value: 1, enumerable: true,
        },
        1: {
          value: 5, enumerable: true,
        },
        2: {
          value: 4, enumerable: true,
        },
        length: { value: 3 },
      });
      const array2 = Object.create(artificialObject, {
        0: {
          value: 5, enumerable: true,
        },
        1: {
          value: 3, enumerable: true,
        },
        2: {
          value: 2, enumerable: true,
        },
        length: { value: 3 },
      });
      const array3 = Object.create(artificialObject, {
        0: {
          value: 2, enumerable: true,
        },
        1: {
          value: 2.5, enumerable: true,
        },
        length: {
          value: 2,
        },
      });
      const array4 = Object.create(artificialObject, {
        0: {
          value: 0, enumerable: true,
        },
        1: {
          value: 30, enumerable: true,
        },
        2: {
          value: 0, enumerable: true,
        },
        length: { value: 3 },
      });
      const results = [
        array1.reduce2(adding, 0),
        array2.reduce2(subtracting, 20),
        array3.reduce2(multiplication, 2),
        array4.reduce2(average, 20),
      ];

      const expected = [10, 10, 10, 10];

      for (let i = 0; i < 4; i++) {
        const value = results[i];

        expect(value)
          .toBe(expected[i]);
      }
    });

    it(`should handle only that elements of array which fulfill condition `
      + `|handledElements| = 'length' value`, () => {
      const artificialObject = { 'reduce2': reduce };

      const array1 = Object.create(artificialObject, {
        0: {
          value: 1, enumerable: true,
        },
        1: {
          value: 5, enumerable: true,
        },
        2: {
          value: 4, enumerable: true,
        },
        3: {
          value: 100, enumerable: true,
        },
        length: { value: 3 },
      });
      const array2 = Object.create(artificialObject, {
        0: {
          value: 5, enumerable: true,
        },
        1: {
          value: 3, enumerable: true,
        },
        2: {
          value: 2, enumerable: true,
        },
        3: {
          value: 200, enumerable: true,
        },
        4: {
          value: 0, enumerable: true,
        },
        length: { value: 3 },
      });
      const array3 = Object.create(artificialObject, {
        4: {
          value: 2, enumerable: true,
        },
        7: {
          value: 2.5, enumerable: true,
        },
        17: {
          value: 5, enumerable: true,
        },
        length: {
          value: 2,
        },
      });
      const array4 = Object.create(artificialObject, {
        3: {
          value: 0, enumerable: true,
        },
        0: {
          value: 30, enumerable: true,
        },
        2: {
          value: 1, enumerable: true,
        },
        1: {
          value: 9, enumerable: true,
        },
        length: { value: 3 },
      });
      const results = [
        array1.reduce2(adding, 0),
        array2.reduce2(subtracting, 20),
        array3.reduce2(multiplication, 2),
        array4.reduce2(average, 20),
      ];

      const expected = [10, 10, 10, 9];

      for (let i = 0; i < 4; i++) {
        const value = results[i];

        expect(value)
          .toBe(expected[i]);
      }
    });
  });
});
