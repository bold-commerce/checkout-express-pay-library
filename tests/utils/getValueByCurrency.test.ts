import {getValueByCurrency} from 'src';

describe('testing getValueByCurrency function', () => {
    const dataSet = [
        {value: -123456789, currency: 'DJF', expected: '-123456789'},
        {value: -123456789, currency: 'GNF', expected: '-123456789'},
        {value: -123456789, currency: 'KMF', expected: '-123456789'},
        {value: -123456789, currency: 'MGA', expected: '-123456789'},
        {value: -123456789, currency: 'VUV', expected: '-123456789'},
        {value: -123456789, currency: 'XOF', expected: '-123456789'},
        {value: -123456789, currency: 'CLP', expected: '-123456789'},
        {value: -123456789, currency: 'PYG', expected: '-123456789'},
        {value: -123456789, currency: 'RWF', expected: '-123456789'},
        {value: -123456789, currency: 'UGX', expected: '-123456789'},
        {value: -123456789, currency: 'VND', expected: '-123456789'},
        {value: -123456789, currency: 'XPF', expected: '-123456789'},
        {value: -123456789, currency: 'HUF', expected: '-123456789'},
        {value: -123456789, currency: 'TWD', expected: '-123456789'},
        {value: 0, currency: 'JPY', expected: '0'},
        {value: 1, currency: 'JPY', expected: '1'},
        {value: 10, currency: 'JPY', expected: '10'},
        {value: 100000000, currency: 'JPY', expected: '100000000'},
        {value: 123456789, currency: 'JPY', expected: '123456789'},
        {value: -123456789, currency: 'JPY', expected: '-123456789'},
        {value: 0, currency: 'USD', expected: '0.00'},
        {value: 1, currency: 'USD', expected: '0.01'},
        {value: 10, currency: 'USD', expected: '0.10'},
        {value: 100000000, currency: 'USD', expected: '1000000.00'},
        {value: 123456789, currency: 'USD', expected: '1234567.89'},
        {value: -123456789, currency: 'USD', expected: '-1234567.89'},
        {value: 0, currency: '', expected: '0'},
        {value: 1, currency: '', expected: '1'},
        {value: 10, currency: '', expected: '10'},
        {value: 100000000, currency: '', expected: '100000000'},
        {value: 123456789, currency: '', expected: '123456789'},
        {value: -123456789, currency: '', expected: '-123456789'},
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each(dataSet)('call getValueByCurrency',
        ({value, currency, expected}) => {
            const result = getValueByCurrency(value, currency);

            expect(result).toBe(expected);
        });
});
