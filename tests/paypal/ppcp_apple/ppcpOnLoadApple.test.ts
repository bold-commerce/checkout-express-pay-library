import {
    ApplePayLoadingError,
    getPaypalNameSpace,
    hasPaypalNameSpaceApple,
    IPaypalNamespaceApple,
    IPPCPAppleConfig,
    IPPCPApplePayInstance,
    ppcpOnLoadApple,
    setPPCPApplePayInstance
} from 'src';
import {mocked} from 'jest-mock';

jest.mock('src/paypal/managePaypalState');
const hasPaypalNameSpaceAppleMock = mocked(hasPaypalNameSpaceApple, true);
const getPaypalNameSpaceMock = mocked(getPaypalNameSpace, true);
const setPPCPApplePayInstanceMock = mocked(setPPCPApplePayInstance, true);
const functionApplePayMock = jest.fn();
const functionConfigMock = jest.fn();

describe('testing ppcpOnLoadApple function', () => {
    const paypalMock: IPaypalNamespaceApple = {version: 'test', Applepay: functionApplePayMock};
    const applePayMock: IPPCPApplePayInstance = {config: functionConfigMock, confirmOrder: jest.fn(), validateMerchant: jest.fn()};
    const applePayConfigMock: IPPCPAppleConfig = {merchantCapabilities: [], supportedNetworks: [], countryCode: 'CA', isEligible: true};
    const errorMessage = 'Some Error Message';

    beforeEach(() => {
        jest.clearAllMocks();
        hasPaypalNameSpaceAppleMock.mockReturnValue(true);
        getPaypalNameSpaceMock.mockReturnValue(paypalMock);
        functionApplePayMock.mockReturnValue(applePayMock);
        functionConfigMock.mockReturnValue(Promise.resolve(applePayConfigMock));
    });

    test('When has paypal.Applepay and isEligible true', async () => {
        await ppcpOnLoadApple();

        expect(hasPaypalNameSpaceAppleMock).toHaveBeenCalledTimes(1);
        expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(functionApplePayMock).toHaveBeenCalledTimes(1);
        expect(functionConfigMock).toHaveBeenCalledTimes(1);
        expect(setPPCPApplePayInstanceMock).toHaveBeenCalledTimes(1);
        expect(setPPCPApplePayInstanceMock).toHaveBeenCalledWith(applePayMock);
        //TODO Add expectation of createPaypalApple .toHaveBeenCalledTimes(1) when it's implemented
    });

    test('When has paypal.Applepay and isEligible false', async () => {
        functionConfigMock.mockReturnValueOnce(Promise.resolve({...applePayConfigMock, isEligible: false}));

        await ppcpOnLoadApple();

        expect(hasPaypalNameSpaceAppleMock).toHaveBeenCalledTimes(1);
        expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(functionApplePayMock).toHaveBeenCalledTimes(1);
        expect(functionConfigMock).toHaveBeenCalledTimes(1);
        expect(setPPCPApplePayInstanceMock).toHaveBeenCalledTimes(1);
        expect(setPPCPApplePayInstanceMock).toHaveBeenCalledWith(applePayMock);
        //TODO Add expectation of createPaypalApple .toHaveBeenCalledTimes(0) when it's implemented
    });

    test('When do NOT has paypal.Applepay', async () => {
        hasPaypalNameSpaceAppleMock.mockReturnValueOnce(false);

        await ppcpOnLoadApple();

        expect(hasPaypalNameSpaceAppleMock).toHaveBeenCalledTimes(1);
        expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(0);
        expect(functionApplePayMock).toHaveBeenCalledTimes(0);
        expect(functionConfigMock).toHaveBeenCalledTimes(0);
        expect(setPPCPApplePayInstanceMock).toHaveBeenCalledTimes(0);
        //TODO Add expectation of createPaypalApple .toHaveBeenCalledTimes(0) when it's implemented
    });

    test('when throw error as instance of Error inside try catch and ApplePayLoadingError is thrown',async () => {
        const errorMock = new Error(errorMessage);
        functionApplePayMock.mockImplementation(() => {
            throw errorMock;
        });

        await ppcpOnLoadApple().then(() => {
            expect('This expect should not run, call should Throw').toBe(null);
        }).catch((error) => {
            expect(hasPaypalNameSpaceAppleMock).toHaveBeenCalledTimes(1);
            expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
            expect(functionApplePayMock).toHaveBeenCalledTimes(1);
            expect(functionConfigMock).toHaveBeenCalledTimes(0);
            expect(setPPCPApplePayInstanceMock).toHaveBeenCalledTimes(0);
            expect(error).toStrictEqual(errorMock);
            expect(error.name).toBe(ApplePayLoadingError.name);
        });
    });

    test('when throw error as string inside try catch Then ApplePayLoadingError is thrown',async () => {
        const expectedErrorMessage = `Error loading Apple Pay: ${errorMessage}`;
        const expectedError = new ApplePayLoadingError(expectedErrorMessage);
        functionApplePayMock.mockImplementation(() => {
            throw errorMessage;
        });

        await ppcpOnLoadApple().then(() => {
            expect('This expect should not run, call should Throw').toBe(null);
        }).catch((error) => {
            expect(hasPaypalNameSpaceAppleMock).toHaveBeenCalledTimes(1);
            expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
            expect(functionApplePayMock).toHaveBeenCalledTimes(1);
            expect(functionConfigMock).toHaveBeenCalledTimes(0);
            expect(setPPCPApplePayInstanceMock).toHaveBeenCalledTimes(0);
            expect(error).toStrictEqual(expectedError);
            expect(error.name).toBe(ApplePayLoadingError.name);
        });
    });
});
