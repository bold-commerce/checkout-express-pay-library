import {IFastlaneInstance, getFastlaneInstance, initFastlane, fastlaneState} from 'src';
import {mocked} from 'jest-mock';

jest.mock('src/fastlane/initFastlane');
const initFastlaneMock = mocked(initFastlane);

describe('testing manage fastlane state functions', () => {
    afterEach(() => {
        jest.resetAllMocks();
        fastlaneState.instance = null;
    });

    test('init fastlane instance should only be called once get instance called multiple times', async () => {
        // Arranging
        initFastlaneMock.mockResolvedValue({} as IFastlaneInstance);

        // Assigning
        await getFastlaneInstance();
        await getFastlaneInstance();

        // Asserting
        expect(initFastlaneMock).toBeCalledTimes(1);
    });

    test('init fastlane instance should be called only once even when init is "in flight"', async () => {
        // Arranging
        let resolve: (i: IFastlaneInstance) => void;
        initFastlaneMock.mockReturnValue(new Promise(r => resolve = r));

        // Assigning
        const calls = [getFastlaneInstance(), getFastlaneInstance()];
        resolve!({} as IFastlaneInstance);
        await Promise.all(calls);

        // Asserting
        expect(initFastlaneMock).toBeCalledTimes(1);
    });

    test('fastlane state should be cleared when init fastlane errors', async () => {
        // Arranging
        initFastlaneMock.mockRejectedValueOnce(new Error('oh no!'));
        initFastlaneMock.mockResolvedValue({} as IFastlaneInstance);

        // Assigning
        await getFastlaneInstance().catch(() => undefined);
        await getFastlaneInstance();

        // Asserting
        expect(initFastlaneMock).toBeCalledTimes(2);
    });
});