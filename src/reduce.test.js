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
});
