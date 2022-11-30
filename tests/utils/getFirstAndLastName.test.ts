import {getFirstAndLastName} from 'src';

describe('testing getFirstAndLastName function', () => {

    const data = [
        {name: 'calling with first name only', payerName: 'John', expected: {firstName: 'John', lastName: ''}},
        {name: 'calling with first and last name', payerName: 'John Steve', expected: {firstName: 'John', lastName: 'Steve'}},
        {name: 'calling with long name', payerName: 'John Steve Ron', expected: {firstName: 'John', lastName: 'Steve Ron'}},
        {name: 'calling with first and last name', payerName: undefined, expected: {firstName: '', lastName: ''}}
    ];

    test.each(data)('$name', ({payerName, expected}) => {
        const result = getFirstAndLastName(payerName);
        expect(result).toStrictEqual(expected);
    });

});
