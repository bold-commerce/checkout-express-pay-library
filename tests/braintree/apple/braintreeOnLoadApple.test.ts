import {mocked} from 'jest-mock';
import {
    ApplePayLoadingError,
    BraintreeNullStateKeyError,
    braintreeOnLoadApple,
    createBraintreeApple,
    getBraintreeAppleCredentialsChecked,
    getBraintreeClient,
    hasBraintreeClient,
    IBraintreeApplePayInstance,
    IBraintreeClient,
    IBraintreeClientInstance,
    setBraintreeApplePayInstance,
} from 'src';
import {IExpressPayBraintreeApple} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/braintree/apple/createBraintreeApple');
const getBraintreeAppleCredentialsCheckedMock = mocked(getBraintreeAppleCredentialsChecked, true);
const setBraintreeApplePayInstanceMock = mocked(setBraintreeApplePayInstance, true);
const hasBraintreeMock = mocked(hasBraintreeClient, true);
const getBraintreeMock = mocked(getBraintreeClient, true);
const createBraintreeAppleMock = mocked(createBraintreeApple, true);

describe('testing braintreeOnLoadGoogle function',() => {
    const clientCreate = jest.fn();
    const googlePayCreate = jest.fn();
    const applePayCreate = jest.fn();
    const braintreeClient = {
        client: {create: clientCreate},
        googlePayment: {create: googlePayCreate},
        applePay: {create: applePayCreate},
    } as IBraintreeClient;
    const createdClient = {} as IBraintreeClientInstance;
    const createdAppleInstance = {} as IBraintreeApplePayInstance;
    const authorization = 'test key';
    const errorMessage = 'Some Error Message';
    const appleCredentials = {tokenization_key: authorization} as IExpressPayBraintreeApple;

    beforeEach(() => {
        jest.resetAllMocks();
        hasBraintreeMock.mockReturnValue(true);
        getBraintreeMock.mockReturnValue(braintreeClient);
        getBraintreeAppleCredentialsCheckedMock.mockReturnValue(appleCredentials);
        clientCreate.mockReturnValue(createdClient);
        applePayCreate.mockReturnValue(createdAppleInstance);
    });

    test('call successfully',async () => {

        await braintreeOnLoadApple().then(() => {
            expect(hasBraintreeMock).toBeCalledTimes(1);
            expect(getBraintreeMock).toBeCalledTimes(1);
            expect(getBraintreeAppleCredentialsCheckedMock).toBeCalledTimes(1);
            expect(clientCreate).toBeCalledTimes(1);
            expect(clientCreate).toBeCalledWith({authorization});
            expect(applePayCreate).toBeCalledTimes(1);
            expect(applePayCreate).toBeCalledWith({client: createdClient});
            expect(setBraintreeApplePayInstanceMock).toBeCalledTimes(1);
            expect(setBraintreeApplePayInstanceMock).toBeCalledWith(createdAppleInstance);
            expect(createBraintreeAppleMock).toBeCalledTimes(1);
        });
    });

    test('Given hasBraintree false',async () => {
        hasBraintreeMock.mockReturnValueOnce(false);

        await braintreeOnLoadApple().then(() => {
            expect(hasBraintreeMock).toBeCalledTimes(1);
            expect(getBraintreeMock).toBeCalledTimes(0);
            expect(getBraintreeAppleCredentialsCheckedMock).toBeCalledTimes(0);
            expect(clientCreate).toBeCalledTimes(0);
            expect(applePayCreate).toBeCalledTimes(0);
            expect(setBraintreeApplePayInstanceMock).toBeCalledTimes(0);
            expect(createBraintreeAppleMock).toBeCalledTimes(0);
        });
    });

    test('Given function throws error as instance of Error inside try catch Then ApplePayLoadingError is thrown',async () => {
        const errorMock = new Error(errorMessage);
        clientCreate.mockImplementation(() => {
            throw errorMock;
        });

        await braintreeOnLoadApple().then(() => {
            expect('This expect should not run, call should Throw').toBe(null);
        }).catch((e) => {
            expect(hasBraintreeMock).toBeCalledTimes(1);
            expect(getBraintreeMock).toBeCalledTimes(1);
            expect(getBraintreeAppleCredentialsCheckedMock).toBeCalledTimes(1);
            expect(clientCreate).toBeCalledTimes(1);
            expect(applePayCreate).toBeCalledTimes(0);
            expect(e).toStrictEqual(errorMock);
            expect(e.name).toBe('ApplePayLoadingError');
        });
    });

    test('Given function throws error as instance of another Error class inside try catch Then ApplePayLoadingError is thrown',async () => {
        const errorMock = new BraintreeNullStateKeyError(errorMessage);
        clientCreate.mockImplementation(() => {
            throw errorMock;
        });

        await braintreeOnLoadApple().then(() => {
            expect('This expect should not run, call should Throw').toBe(null);
        }).catch((e) => {
            expect(hasBraintreeMock).toBeCalledTimes(1);
            expect(getBraintreeMock).toBeCalledTimes(1);
            expect(getBraintreeAppleCredentialsCheckedMock).toBeCalledTimes(1);
            expect(clientCreate).toBeCalledTimes(1);
            expect(applePayCreate).toBeCalledTimes(0);
            expect(e).toStrictEqual(errorMock);
            expect(e.name).toBe('ApplePayLoadingError');
        });
    });

    test('Given function throws error as string inside try catch Then ApplePayLoadingError is thrown',async () => {
        const expectedErrorMessage = `Error loading Apple Pay: ${errorMessage}`;
        const expectedError = new ApplePayLoadingError(expectedErrorMessage);
        clientCreate.mockImplementation(() => {
            throw errorMessage;
        });

        await braintreeOnLoadApple().then(() => {
            expect('This expect should not run, call should Throw').toBe(null);
        }).catch((e) => {
            expect(hasBraintreeMock).toBeCalledTimes(1);
            expect(getBraintreeMock).toBeCalledTimes(1);
            expect(getBraintreeAppleCredentialsCheckedMock).toBeCalledTimes(1);
            expect(clientCreate).toBeCalledTimes(1);
            expect(applePayCreate).toBeCalledTimes(0);
            expect(e).toStrictEqual(expectedError);
            expect(e.name).toBe('ApplePayLoadingError');
        });
    });

});
