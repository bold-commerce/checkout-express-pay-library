import {isJSAdded} from 'src';

describe('testing isJSAdded function', () => {
    const matchedUrl = 'https://match.com/test.js';
    const HEAD = document.getElementsByTagName('head')[0];
    const matchedScript = document.createElement('script');
    const unmatchedScript = document.createElement('script');

    const data = [
        {name: 'It has JS', url: matchedUrl, headChild: matchedScript, expected: true},
        {name: 'It does not have JS', url: matchedUrl, headChild: unmatchedScript, expected: false},
    ];

    beforeEach(() => {
        HEAD.innerHTML = '';
        matchedScript.setAttribute('src', matchedUrl);
        unmatchedScript.setAttribute('src', 'https://unmatch.com/test.js');
    });

    test.each(data)('calling isJSAdded', ({url, headChild, expected}) => {
        HEAD.append(headChild);

        const result = isJSAdded(url);
        expect(result).toStrictEqual(expected);
    });

});
