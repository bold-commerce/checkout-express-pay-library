import {getFormattedValue} from 'src';

describe('testing getFormattedValue function', () => {
    const dataSet = [
        {value: 0, decimalFactor: 0, decimalPoint: '', separator: '', expected: '0'},
        {value: 0, decimalFactor: 2, decimalPoint: '', separator: '', expected: '000'},
        {value: 1, decimalFactor: 0, decimalPoint: '', separator: '', expected: '1'},
        {value: 1, decimalFactor: 2, decimalPoint: '', separator: '', expected: '001'},
        {value: 10, decimalFactor: 0, decimalPoint: '', separator: '', expected: '10'},
        {value: 10, decimalFactor: 2, decimalPoint: '', separator: '', expected: '010'},
        {value: 100000000, decimalFactor: 0, decimalPoint: '', separator: '', expected: '100000000'},
        {value: 100000000, decimalFactor: 2, decimalPoint: '', separator: '', expected: '100000000'},
        {value: 123456789, decimalFactor: 0, decimalPoint: '', separator: '', expected: '123456789'},
        {value: 123456789, decimalFactor: 2, decimalPoint: '', separator: '', expected: '123456789'},
        {value: 123456789, decimalFactor: 0, decimalPoint: '.', separator: '', expected: '123456789'},
        {value: 123456789, decimalFactor: 2, decimalPoint: '.', separator: '', expected: '1234567.89'},
        {value: 123456789, decimalFactor: 0, decimalPoint: '', separator: ',', expected: '123,456,789'},
        {value: 123456789, decimalFactor: 2, decimalPoint: '', separator: ',', expected: '1,234,56789'},
        {value: 123456789, decimalFactor: 0, decimalPoint: '.', separator: ',', expected: '123,456,789'},
        {value: 123456789, decimalFactor: 2, decimalPoint: '.', separator: ',', expected: '1,234,567.89'},
        {value: 100000000, decimalFactor: 0, decimalPoint: '.', separator: ',', expected: '100,000,000'},
        {value: 100000000, decimalFactor: 2, decimalPoint: '.', separator: ',', expected: '1,000,000.00'},
        {value: 0, decimalFactor: 0, decimalPoint: '.', separator: ',', expected: '0'},
        {value: 0, decimalFactor: 2, decimalPoint: '.', separator: ',', expected: '0.00'},
        {value: 1, decimalFactor: 0, decimalPoint: '.', separator: ',', expected: '1'},
        {value: 1, decimalFactor: 2, decimalPoint: '.', separator: ',', expected: '0.01'},
        {value: 3269, decimalFactor: 2, decimalPoint: '.', separator: '', expected: '32.69'},
        {value: 3261, decimalFactor: 2, decimalPoint: '.', separator: '', expected: '32.61'},
        {value: 123456789, decimalFactor: 0, decimalPoint: undefined, separator: undefined, expected: '123,456,789'},
        {value: 123456789, decimalFactor: 2, decimalPoint: undefined, separator: undefined, expected: '1,234,567.89'},
        {value: 123456789, decimalFactor: undefined, decimalPoint: undefined, separator: undefined, expected: '1,234,567.89'},
        {value: 123456789, decimalFactor: 3, decimalPoint: '.', separator: ',', expected: '123,456.789'},
        {value: 123456789, decimalFactor: 4, decimalPoint: '.', separator: ',', expected: '12,345.6789'},
        {value: 123456789, decimalFactor: 5, decimalPoint: '.', separator: ',', expected: '1,234.56789'},
        {value: 123456789, decimalFactor: 6, decimalPoint: '.', separator: ',', expected: '123.456789'},
        {value: -123456789, decimalFactor: 0, decimalPoint: '', separator: '', expected: '-123456789'},
        {value: -123456789, decimalFactor: 2, decimalPoint: '', separator: '', expected: '-123456789'},
        {value: -123456789, decimalFactor: 0, decimalPoint: '.', separator: '', expected: '-123456789'},
        {value: -123456789, decimalFactor: 2, decimalPoint: '.', separator: '', expected: '-1234567.89'},
        {value: -123456789, decimalFactor: 0, decimalPoint: '', separator: ',', expected: '-123,456,789'},
        {value: -123456789, decimalFactor: 2, decimalPoint: '', separator: ',', expected: '-1,234,56789'},
        {value: -123456789, decimalFactor: 0, decimalPoint: '.', separator: ',', expected: '-123,456,789'},
        {value: -123456789, decimalFactor: 2, decimalPoint: '.', separator: ',', expected: '-1,234,567.89'},
        {value: -123456789, decimalFactor: 3, decimalPoint: '.', separator: ',', expected: '-123,456.789'},
        {value: -123456789, decimalFactor: 4, decimalPoint: '.', separator: ',', expected: '-12,345.6789'},
        {value: -123456789, decimalFactor: 5, decimalPoint: '.', separator: ',', expected: '-1,234.56789'},
        {value: -123456789, decimalFactor: 6, decimalPoint: '.', separator: ',', expected: '-123.456789'},
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each(dataSet)('call getFormattedValue $value- $decimalPoint - $separator - $expected',
        ({value, decimalFactor, decimalPoint, separator, expected}) => {
            const result = getFormattedValue(value, decimalFactor, decimalPoint, separator);

            expect(result).toBe(expected);
        });
});
