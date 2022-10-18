import {
    loadJS,
    getBraintreeJsUrls,
    IBraintreeUrls,
    initBraintreeApple,
    setBraintreeAppleCredentials
} from 'src';
import {mocked} from 'jest-mock';
import {
    alternatePaymentMethodType,
    IExpressPayBraintree,
    IExpressPayBraintreeApple
} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/braintree/getBraintreeJsUrls');
jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/utils/loadJS');
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
    appleJsURL: 'https://test.com/appleJsURL.js'
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
        expect(loadJSMock).toHaveBeenCalledWith(jsUrls.clientJsURL);
        expect(loadJSMock).toHaveBeenCalledWith(jsUrls.appleJsURL);
        expect(loadJSMock).toHaveBeenCalledWith(jsUrls.dataCollectorJsURL);
    });

    test('loadJS rejects', () => {
        const rejectMsg = 'Test Reject';
        loadJSMock.mockReturnValueOnce(Promise.reject(rejectMsg));

        initBraintreeApple(braintreePaymentApple).then(() => {
            expect(loadJSMock).toHaveBeenCalledTimes(1);
        }).catch(e => {
            expect(e).toBe(rejectMsg);
            expect(getBraintreeJsUrlsMock).toHaveBeenCalledTimes(1);
            expect(setBraintreeAppleCredentialsMock).toHaveBeenCalledTimes(1);
            expect(loadJSMock).toHaveBeenCalledTimes(1);
            expect(loadJSMock).toHaveBeenCalledWith(jsUrls.clientJsURL);
        });
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
