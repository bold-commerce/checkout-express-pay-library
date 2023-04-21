import {
    braintreeConstants,
    braintreeOnClickApple,
    braintreeOnPaymentAuthorizedApple,
    braintreeOnShippingContactSelectedApple,
    braintreeOnShippingMethodSelectedApple,
    braintreeOnValidateMerchantApple,
    getBraintreeApplePayInstanceChecked,
    getPaymentRequestDisplayItems,
    IBraintreeApplePayInstance,
    setBraintreeApplePaySession
} from 'src';
import {mocked} from 'jest-mock';
import {getApplicationState, getCurrency, getOrderInitialData} from '@bold-commerce/checkout-frontend-library';
import {
    applicationStateMock,
    currencyMock,
    orderInitialDataMock
} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import ApplePayPaymentRequest = ApplePayJS.ApplePayPaymentRequest;

jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/utils/getPaymentRequestDisplayItems');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getApplicationState');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getOrderInitialData');
const getBraintreeApplePayInstanceCheckedMock = mocked(getBraintreeApplePayInstanceChecked, true);
const getCurrencyMock = mocked(getCurrency, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const getPaymentRequestDisplayItemMock = mocked(getPaymentRequestDisplayItems, true);
const setBraintreeApplePaySessionMock = mocked(setBraintreeApplePaySession, true);

describe('testing braintreeOnClickApple function', () => {
    const applePaySessionMock = jest.fn();
    const createPaymentRequest = jest.fn();
    const performValidation = jest.fn();
    const tokenize = jest.fn();
    const applePaySessionBegin = jest.fn();
    const preventDefaultMock = jest.fn();
    const mouseEventMock: MouseEvent = new MouseEvent('click');
    mouseEventMock.preventDefault = preventDefaultMock;
    const applePaySessionObj = {
        onvalidatemerchant: null,
        onshippingcontactselected: null,
        onshippingmethodselected: null,
        onpaymentauthorized: null,
        begin: applePaySessionBegin
    };
    const appleInstance: IBraintreeApplePayInstance = {createPaymentRequest, performValidation, tokenize};
    const displayItemMock = [{label: 'test', amount: 1200}];
    const applePaymentRequest: ApplePayPaymentRequest = {
        countryCode: 'US',
        currencyCode: 'USD',
        merchantCapabilities: [],
        supportedNetworks: [],
        total: {amount: '12.00', label: 'test'}
    };
    const fieldsWithPhone = ['postalAddress', 'email', 'phone'];
    const fieldsWithoutPhone = ['postalAddress', 'email'];
    const createPaymentRequestParam = {
        currencyCode: 'USD',
        lineItems: [{amount: '12.00', label: 'test'}],
        requiredBillingContactFields: fieldsWithoutPhone,
        requiredShippingContactFields: fieldsWithoutPhone,
        total: {amount: '100.00', label: 'Total'},
    };

    beforeEach(() => {
        jest.clearAllMocks();
        applePaySessionObj.onvalidatemerchant = null;
        applePaySessionObj.onshippingcontactselected = null;
        applePaySessionObj.onshippingmethodselected = null;
        applePaySessionObj.onpaymentauthorized = null;
        getBraintreeApplePayInstanceCheckedMock.mockReturnValue(appleInstance);
        getCurrencyMock.mockReturnValue(currencyMock);
        getApplicationStateMock.mockReturnValue(applicationStateMock);
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
        getPaymentRequestDisplayItemMock.mockReturnValueOnce(displayItemMock);
        applePaySessionMock.mockReturnValue(applePaySessionObj);
        createPaymentRequest.mockReturnValue(applePaymentRequest);
        global.window.ApplePaySession = applePaySessionMock;
    });

    test('called successfully phone not required', () => {
        braintreeOnClickApple(mouseEventMock);

        expect(preventDefaultMock).toBeCalledTimes(1);
        expect(getBraintreeApplePayInstanceCheckedMock).toBeCalledTimes(1);
        expect(getCurrencyMock).toBeCalledTimes(1);
        expect(getApplicationStateMock).toBeCalledTimes(1);
        expect(getOrderInitialDataMock).toBeCalledTimes(1);
        expect(getPaymentRequestDisplayItemMock).toBeCalledTimes(1);
        expect(createPaymentRequest).toBeCalledTimes(1);
        expect(createPaymentRequest).toBeCalledWith(createPaymentRequestParam);
        expect(applePaySessionMock).toBeCalledTimes(1);
        expect(applePaySessionMock).toBeCalledWith(
            braintreeConstants.APPLEPAY_VERSION_NUMBER,
            applePaymentRequest
        );
        expect(applePaySessionObj.onvalidatemerchant).toBe(braintreeOnValidateMerchantApple);
        expect(applePaySessionObj.onshippingcontactselected).toBe(braintreeOnShippingContactSelectedApple);
        expect(applePaySessionObj.onshippingmethodselected).toBe(braintreeOnShippingMethodSelectedApple);
        expect(applePaySessionObj.onpaymentauthorized).toBe(braintreeOnPaymentAuthorizedApple);
        expect(applePaySessionBegin).toBeCalledTimes(1);
        expect(setBraintreeApplePaySessionMock).toBeCalledTimes(1);
        expect(setBraintreeApplePaySessionMock).toBeCalledWith(applePaySessionObj);
    });

    test('called successfully phone required', () => {
        const {general_settings: generalSettings} = orderInitialDataMock;
        const {checkout_process: checkoutProcess} = generalSettings;
        const newGeneralSettings = {...generalSettings, checkout_process: {...checkoutProcess, phone_number_required: true}};
        const initialData = {...orderInitialDataMock, general_settings: newGeneralSettings};
        const newCreatePaymentRequestParam = {
            ...createPaymentRequestParam,
            requiredBillingContactFields: fieldsWithPhone,
            requiredShippingContactFields: fieldsWithPhone
        };
        getOrderInitialDataMock.mockReturnValueOnce(initialData);

        braintreeOnClickApple(mouseEventMock);

        expect(preventDefaultMock).toBeCalledTimes(1);
        expect(getBraintreeApplePayInstanceCheckedMock).toBeCalledTimes(1);
        expect(getCurrencyMock).toBeCalledTimes(1);
        expect(getApplicationStateMock).toBeCalledTimes(1);
        expect(getOrderInitialDataMock).toBeCalledTimes(1);
        expect(getPaymentRequestDisplayItemMock).toBeCalledTimes(1);
        expect(createPaymentRequest).toBeCalledTimes(1);
        expect(createPaymentRequest).toBeCalledWith(newCreatePaymentRequestParam);
        expect(applePaySessionMock).toBeCalledTimes(1);
        expect(applePaySessionMock).toBeCalledWith(
            braintreeConstants.APPLEPAY_VERSION_NUMBER,
            applePaymentRequest
        );
        expect(applePaySessionObj.onvalidatemerchant).toBe(braintreeOnValidateMerchantApple);
        expect(applePaySessionObj.onshippingcontactselected).toBe(braintreeOnShippingContactSelectedApple);
        expect(applePaySessionObj.onshippingmethodselected).toBe(braintreeOnShippingMethodSelectedApple);
        expect(applePaySessionObj.onpaymentauthorized).toBe(braintreeOnPaymentAuthorizedApple);
        expect(applePaySessionBegin).toBeCalledTimes(1);
        expect(setBraintreeApplePaySessionMock).toBeCalledTimes(1);
        expect(setBraintreeApplePaySessionMock).toBeCalledWith(applePaySessionObj);
    });

    test('call with failure', () => {
        const error = new Error('Error Test!');
        getBraintreeApplePayInstanceCheckedMock.mockImplementationOnce(() => {
            throw error;
        });

        try {
            braintreeOnClickApple(mouseEventMock);
            expect('This expect should not run, call should Throw').toBe(null);
        } catch (e) {
            expect(e).toBe(error);
            expect(preventDefaultMock).toBeCalledTimes(1);
            expect(getBraintreeApplePayInstanceCheckedMock).toBeCalledTimes(1);
            expect(getCurrencyMock).toBeCalledTimes(0);
            expect(getApplicationStateMock).toBeCalledTimes(0);
            expect(getOrderInitialDataMock).toBeCalledTimes(0);
            expect(getPaymentRequestDisplayItemMock).toBeCalledTimes(0);
            expect(createPaymentRequest).toBeCalledTimes(0);
            expect(applePaySessionMock).toBeCalledTimes(0);
            expect(applePaySessionObj.onvalidatemerchant).toBe(null);
            expect(applePaySessionObj.onshippingcontactselected).toBe(null);
            expect(applePaySessionObj.onshippingmethodselected).toBe(null);
            expect(applePaySessionObj.onpaymentauthorized).toBe(null);
            expect(applePaySessionBegin).toBeCalledTimes(0);
            expect(setBraintreeApplePaySessionMock).toBeCalledTimes(0);
        }
    });
});
