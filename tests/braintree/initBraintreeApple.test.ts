import {
    loadJS,
    getBraintreeJsUrls,
    IBraintreeUrls,
    initBraintreeApple,
    setBraintreeAppleCredentials, braintreeOnLoadClient, braintreeOnLoadApple
} from 'src';
import {mocked} from 'jest-mock';
import {
    alternatePaymentMethodType,
    IExpressPayBraintree,
    IExpressPayBraintreeApple
} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/braintree/getBraintreeJsUrls');
jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/braintree/braintreeOnLoadClient');
jest.mock('src/braintree/apple/braintreeOnLoadApple');
jest.mock('src/utils/loadJS');
const braintreeOnLoadClientMock = mocked(braintreeOnLoadClient, true);
const braintreeOnLoadAppleMock = mocked(braintreeOnLoadApple, true);
const loadJSMock = mocked(loadJS, true);
const getBraintreeJsUrlsMock = mocked(getBraintreeJsUrls, true);
const setBraintreeAppleCredentialsMock = mocked(setBraintreeAppleCredentials, true);

const braintreePayment: IExpressPayBraintree = {
    type: alternatePaymentMethodType.BRAINTREE_GOOGLE,
    public_id: 'somePublicId',
    is_test: true,
    merchant_account: 'someMerchantAccount',
    tokenization_key: 'someTokenizationKey',
    button_style: {}
};
const braintreePaymentApple: IExpressPayBraintreeApple = {
    ...braintreePayment,
    type: alternatePaymentMethodType.BRAINTREE_APPLE,
    apple_pay_enabled: true
};
const jsUrls: IBraintreeUrls = {
    clientJsURL: 'https://test.com/clientJsURL.js',
    googleJsUrl: 'https://test.com/googleJsUrl.js',
    dataCollectorJsURL: 'https://test.com/dataCollectorJsURL.js',
    appleJsURL: 'https://test.com/appleJsURL.js',
    braintreeGoogleJsURL: 'https://test.com/braintreeGoogleJsURL.js'
};
const supportsVersionMock = jest.fn();
const canMakePaymentsMock = jest.fn();
const applePaySession = {supportsVersion: supportsVersionMock, canMakePayments: canMakePaymentsMock};

describe('testing initBraintreeApple function', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        getBraintreeJsUrlsMock.mockReturnValue(jsUrls);
        loadJSMock.mockReturnValue(Promise.resolve());
        supportsVersionMock.mockReturnValue(true);
        canMakePaymentsMock.mockReturnValue(true);
        window.ApplePaySession = applePaySession;
    });

    test('loadJS resolves', async () => {
        await initBraintreeApple(braintreePaymentApple);

        expect(getBraintreeJsUrlsMock).toHaveBeenCalledTimes(1);
        expect(setBraintreeAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(loadJSMock).toHaveBeenCalledTimes(3);
        expect(loadJSMock).toHaveBeenCalledWith(jsUrls.clientJsURL, braintreeOnLoadClientMock);
        expect(loadJSMock).toHaveBeenCalledWith(jsUrls.appleJsURL, braintreeOnLoadAppleMock);
        expect(loadJSMock).toHaveBeenCalledWith(jsUrls.dataCollectorJsURL);
    });

    test('loadJS rejects', async () => {
        const rejectMsg = 'Test Reject';
        loadJSMock.mockReturnValueOnce(Promise.reject(rejectMsg));

        try {
            await initBraintreeApple(braintreePaymentApple);
            expect('This expect should not run, call should Throw').toBe(null);
        } catch (e) {
            expect(e).toBe(rejectMsg);
            expect(getBraintreeJsUrlsMock).toHaveBeenCalledTimes(1);
            expect(setBraintreeAppleCredentialsMock).toHaveBeenCalledTimes(1);
            expect(loadJSMock).toHaveBeenCalledTimes(1);
            expect(loadJSMock).toHaveBeenCalledWith(jsUrls.clientJsURL, braintreeOnLoadClientMock);
        }
    });

    test('Its not Apple Session', async () => {
        window.ApplePaySession = undefined;

        await initBraintreeApple(braintreePaymentApple);

        expect(getBraintreeJsUrlsMock).toHaveBeenCalledTimes(1);
        expect(setBraintreeAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(loadJSMock).toHaveBeenCalledTimes(0);
    });

    test('Apple Session does not supportsVersion', async () => {
        supportsVersionMock.mockReturnValueOnce(false);

        await initBraintreeApple(braintreePaymentApple);

        expect(getBraintreeJsUrlsMock).toHaveBeenCalledTimes(1);
        expect(setBraintreeAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(loadJSMock).toHaveBeenCalledTimes(0);
    });

    test('Apple Session can not Make Payments', async () => {
        canMakePaymentsMock.mockReturnValueOnce(false);

        await initBraintreeApple(braintreePaymentApple);

        expect(getBraintreeJsUrlsMock).toHaveBeenCalledTimes(1);
        expect(setBraintreeAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(loadJSMock).toHaveBeenCalledTimes(0);
    });

});
