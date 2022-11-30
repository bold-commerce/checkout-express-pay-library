import {
    loadJS,
    initBraintreeGoogle,
    getBraintreeJsUrls,
    setBraintreeGoogleCredentials,
    IBraintreeUrls,
    braintreeOnLoadClient,
    braintreeOnLoadGoogle
} from 'src';
import {mocked} from 'jest-mock';
import {
    alternatePaymentMethodType,
    IExpressPayBraintree,
    IExpressPayBraintreeGoogle
} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/braintree/getBraintreeJsUrls');
jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/utils/loadJS');
jest.mock('src/braintree/braintreeOnLoadClient');
jest.mock('src/braintree/google/braintreeOnLoadGoogle');
const loadJSMock = mocked(loadJS, true);
const getBraintreeJsUrlsMock = mocked(getBraintreeJsUrls, true);
const setBraintreeGoogleCredentialsMock = mocked(setBraintreeGoogleCredentials, true);
const braintreeOnLoadClientMock = mocked(braintreeOnLoadClient, true);
const braintreeOnLoadGoogleMock = mocked(braintreeOnLoadGoogle, true);

const braintreePayment: IExpressPayBraintree = {
    type: alternatePaymentMethodType.BRAINTREE_GOOGLE,
    public_id: 'somePublicId',
    is_test: true,
    merchant_account: 'someMerchantAccount',
    tokenization_key: 'someTokenizationKey',
    button_style: {}
};
const braintreePaymentGoogle: IExpressPayBraintreeGoogle = {
    ...braintreePayment,
    google_pay_enabled: true,
    google_pay_merchant_identifier: 'someGooglePayMerchantIdentifier',
    apiVersion: 'someApiVersion',
    sdkVersion: 'someSdkVersion',
    merchantId: 'someMerchantId',
};
const jsUrls: IBraintreeUrls = {
    clientJsURL: 'https://test.com/clientJsURL.js',
    googleJsUrl: 'https://test.com/googleJsUrl.js',
    dataCollectorJsURL: 'https://test.com/dataCollectorJsURL.js',
    appleJsURL: 'https://test.com/appleJsURL.js',
    braintreeGoogleJsURL: 'https://test.com/braintreeGoogleJsURL.js'
};

describe('testing initBraintreeGoogle function', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        getBraintreeJsUrlsMock.mockReturnValue(jsUrls);
        loadJSMock.mockReturnValue(Promise.resolve());
    });

    test('loadJS resolves', async () => {
        await initBraintreeGoogle(braintreePaymentGoogle);

        expect(getBraintreeJsUrlsMock).toHaveBeenCalledTimes(1);
        expect(setBraintreeGoogleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(loadJSMock).toHaveBeenCalledTimes(4);
        expect(loadJSMock).toHaveBeenCalledWith(jsUrls.clientJsURL, braintreeOnLoadClientMock);
        expect(loadJSMock).toHaveBeenCalledWith(jsUrls.googleJsUrl, braintreeOnLoadGoogleMock);
        expect(loadJSMock).toHaveBeenCalledWith(jsUrls.dataCollectorJsURL);
        expect(loadJSMock).toHaveBeenCalledWith(jsUrls.braintreeGoogleJsURL, braintreeOnLoadClientMock);
    });

    test('loadJS rejects', async () => {
        const rejectMsg = 'Test Reject';
        loadJSMock.mockReturnValueOnce(Promise.reject(rejectMsg));

        try {
            await initBraintreeGoogle(braintreePaymentGoogle);
            expect('This expect should not run, call should Throw').toBe(null);
        } catch (e) {
            expect(e).toBe(rejectMsg);
            expect(getBraintreeJsUrlsMock).toHaveBeenCalledTimes(1);
            expect(setBraintreeGoogleCredentialsMock).toHaveBeenCalledTimes(1);
            expect(loadJSMock).toHaveBeenCalledTimes(1);
            expect(loadJSMock).toHaveBeenCalledWith(jsUrls.clientJsURL, braintreeOnLoadClientMock);
        }
    });

});
