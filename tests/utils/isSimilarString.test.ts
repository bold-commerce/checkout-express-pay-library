import {isSimilarStrings} from 'src';

describe('testing isSimilarStrings', () => {

    const dataSet = [
        {
            name: 'Passing empty strings',
            var1: '',
            var2: '',
            expected: true
        },
        {
            name: 'Passing empty strings with spaces',
            var1: '  ',
            var2: '  ',
            expected: true
        },
        {
            name: 'Passing strings with one identical word',
            var1: 'test',
            var2: 'test',
            expected: true
        },
        {
            name: 'Passing strings with two identical words',
            var1: 'test something',
            var2: 'test something',
            expected: true
        },
        {
            name: 'Passing strings with one similar word only different case',
            var1: 'TeSt',
            var2: 'test',
            expected: true
        },
        {
            name: 'Passing strings with two similar words only different case',
            var1: 'TeSt SoMeThInG',
            var2: 'test Something',
            expected: true
        },
        {
            name: 'Passing strings with two similar words only different case and trailing spaces',
            var1: 'TeSt SoMeThInG ',
            var2: '  test Something',
            expected: true
        },
        {
            name: 'Passing strings with two NOT similar words different case and extra inner space',
            var1: 'TeSt  SoMeThInG',
            var2: 'test Something',
            expected: false
        },
        {
            name: 'Passing strings with two NOT similar words different strings',
            var1: 'Some testing',
            var2: 'test Something',
            expected: false
        },
    ];

    test.each(dataSet)(
        'Testing isSimilarStrings dataSet',
        ({var1, var2, expected}) => {
            const result = isSimilarStrings(var1, var2);
            expect(result).toBe(expected);
        });
});
