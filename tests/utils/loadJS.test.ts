import {loadCustomScript} from '@paypal/paypal-js';
import {isJSAdded, loadJS} from 'src';
import {mocked} from 'jest-mock';

jest.mock('@paypal/paypal-js');
jest.mock('src/utils/isJSAdded');
const isJSAddedMock = mocked(isJSAdded, true);
const loadCustomScriptMock = mocked(loadCustomScript, true);

describe('testing loadJS function', () => {
    const testUrl = 'https://match.com/test.js';
    const options = {id: 'someTestId'};
    const onLoadMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        isJSAddedMock.mockReturnValue(false);
        loadCustomScriptMock.mockReturnValue(Promise.resolve());
    });

    test('happy path', async () => {
        isJSAddedMock.mockReturnValueOnce(false).mockReturnValueOnce(true);

        await loadJS(testUrl, onLoadMock, options);

        expect(loadCustomScriptMock).toHaveBeenCalledTimes(1);
        expect(loadCustomScriptMock).toHaveBeenCalledWith({url: testUrl, attributes: options});
        expect(isJSAddedMock).toHaveBeenCalledTimes(2);
        expect(isJSAddedMock).toHaveBeenCalledWith(testUrl);
        expect(onLoadMock).toHaveBeenCalledTimes(1);
    });

    test('without onLoad and options', async () => {
        isJSAddedMock.mockReturnValueOnce(false).mockReturnValueOnce(true);

        await loadJS(testUrl);

        expect(loadCustomScriptMock).toHaveBeenCalledTimes(1);
        expect(loadCustomScriptMock).toHaveBeenCalledWith({url: testUrl});
        expect(isJSAddedMock).toHaveBeenCalledTimes(2);
        expect(isJSAddedMock).toHaveBeenCalledWith(testUrl);
        expect(onLoadMock).toHaveBeenCalledTimes(0);
    });

    test('already loaded', async () => {
        isJSAddedMock.mockReturnValueOnce(true).mockReturnValueOnce(true);

        await loadJS(testUrl, onLoadMock, options);

        expect(loadCustomScriptMock).toHaveBeenCalledTimes(0);
        expect(isJSAddedMock).toHaveBeenCalledTimes(2);
        expect(isJSAddedMock).toHaveBeenCalledWith(testUrl);
        expect(onLoadMock).toHaveBeenCalledTimes(1);
    });

    test('script not added', async () => {
        isJSAddedMock.mockReturnValueOnce(false).mockReturnValueOnce(false);

        loadJS(testUrl, onLoadMock, options).then(() => {
            expect(onLoadMock).toHaveBeenCalledTimes(0);
        }).catch(e => {
            expect(e).toBe('Script tag not added');
            expect(loadCustomScriptMock).toHaveBeenCalledTimes(1);
            expect(loadCustomScriptMock).toHaveBeenCalledWith({url: testUrl, attributes: options});
            expect(isJSAddedMock).toHaveBeenCalledTimes(2);
            expect(isJSAddedMock).toHaveBeenCalledWith(testUrl);
            expect(onLoadMock).toHaveBeenCalledTimes(0);
        });
    });

});
