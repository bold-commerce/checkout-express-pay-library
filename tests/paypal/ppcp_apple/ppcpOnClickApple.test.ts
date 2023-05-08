import {mocked} from 'jest-mock';
import {getCurrency, getOrderInitialData, IOrderInitialData} from '@boldcommerce/checkout-frontend-library';
import {currencyMock, orderInitialDataMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {
    ppcpOnClickApple,
    ppcpOnShippingContactSelectedApple,
    getPaymentRequestDisplayItems,
    getPPCPApplePayConfigChecked,
    getTotals,
    IPPCPAppleConfig,
    ITotals,
    setPPCPApplePaySession,
    paypalConstants,
    ppcpOnValidateMerchantApple,
    ppcpOnShippingMethodSelectedApple
} from 'src';
import ApplePayPaymentRequest = ApplePayJS.ApplePayPaymentRequest;
import ApplePayContactField = ApplePayJS.ApplePayContactField;
import ApplePayLineItem = ApplePayJS.ApplePayLineItem;

jest.mock('src/paypal/managePaypalState');
jest.mock('src/utils/getPaymentRequestDisplayItems');
jest.mock('src/utils/getTotals');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getOrderInitialData');
const getPPCPApplePayConfigCheckedMock = mocked(getPPCPApplePayConfigChecked, true);
const getCurrencyMock = mocked(getCurrency, true);
const getTotalsMock = mocked(getTotals, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const getPaymentRequestDisplayItemMock = mocked(getPaymentRequestDisplayItems, true);
const setPPCPApplePaySessionMock = mocked(setPPCPApplePaySession, true);

describe('testing ppcpOnClickApple function', () => {
    const applePaySessionMock = jest.fn();
    const applePaySessionBegin = jest.fn();
    const applePaySessionAbort = jest.fn();
    const preventDefaultMock = jest.fn();
    const mouseEventMock: MouseEvent = new MouseEvent('click');
    mouseEventMock.preventDefault = preventDefaultMock;
    const applePaySessionObj = {
        oncancel: null,
        onvalidatemerchant: null,
        onshippingcontactselected: null,
        onshippingmethodselected: null,
        onpaymentauthorized: null,
        begin: applePaySessionBegin,
        abort: applePaySessionAbort
    };
    const ppcpAppleConfigMock: IPPCPAppleConfig = {countryCode: 'US', isEligible: true, merchantCapabilities: [], supportedNetworks: []};
    const displayItemMock = [{label: 'test', amount: 1200}];
    const displayItemMappedMock: Array<ApplePayLineItem> = [{label: 'test', amount: '12.00'}];
    const fieldsWithPhone: Array<ApplePayContactField> = ['name', 'postalAddress', 'email', 'phone'];
    const fieldsWithoutPhone: Array<ApplePayContactField> = ['name', 'postalAddress', 'email'];
    const applePaymentRequest: ApplePayPaymentRequest = {
        countryCode: 'US',
        currencyCode: 'USD',
        merchantCapabilities: [],
        supportedNetworks: [],
        lineItems: displayItemMappedMock,
        requiredShippingContactFields: fieldsWithoutPhone,
        requiredBillingContactFields: fieldsWithoutPhone,
        total: {amount: '100.00', label: 'Total'}
    };
    const totalsMock: ITotals = {
        totalSubtotal: 0,
        totalOrder: 10000,
        totalAmountDue: 10000,
        totalPaid: 0,
        totalFees: 0,
        totalTaxes: 0,
        totalDiscounts: 0,
        totalAdditionalFees: 0
    };

    beforeEach(() => {
        jest.clearAllMocks();
        applePaySessionObj.oncancel = null;
        applePaySessionObj.onvalidatemerchant = null;
        applePaySessionObj.onshippingcontactselected = null;
        applePaySessionObj.onshippingmethodselected = null;
        applePaySessionObj.onpaymentauthorized = null;
        getPPCPApplePayConfigCheckedMock.mockReturnValue(ppcpAppleConfigMock);
        getCurrencyMock.mockReturnValue(currencyMock);
        getTotalsMock.mockReturnValue(totalsMock);
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
        getPaymentRequestDisplayItemMock.mockReturnValueOnce(displayItemMock);
        applePaySessionMock.mockReturnValue(applePaySessionObj);
        global.window.ApplePaySession = applePaySessionMock;
    });

    test('called successfully triggering oncancel', () => {
        ppcpOnClickApple(mouseEventMock);

        expect(preventDefaultMock).toBeCalledTimes(1);
        expect(getPPCPApplePayConfigCheckedMock).toBeCalledTimes(1);
        expect(getCurrencyMock).toBeCalledTimes(1);
        expect(getTotalsMock).toBeCalledTimes(1);
        expect(getOrderInitialDataMock).toBeCalledTimes(1);
        expect(getPaymentRequestDisplayItemMock).toBeCalledTimes(1);
        expect(applePaySessionMock).toBeCalledTimes(1);
        expect(applePaySessionMock).toBeCalledWith(
            paypalConstants.APPLEPAY_VERSION_NUMBER,
            applePaymentRequest
        );
        expect(applePaySessionObj.onvalidatemerchant).toBe(ppcpOnValidateMerchantApple);
        expect(applePaySessionObj.onshippingcontactselected).toBe(ppcpOnShippingContactSelectedApple);
        expect(applePaySessionObj.onshippingmethodselected).toBe(ppcpOnShippingMethodSelectedApple);
        // expect(applePaySessionObj.onpaymentauthorized).toBe(() => {/*TODO implement ppcpOnPaymentAuthorized*/});
        expect(applePaySessionBegin).toBeCalledTimes(1);
        expect(setPPCPApplePaySessionMock).toBeCalledTimes(1);
        expect(setPPCPApplePaySessionMock).toBeCalledWith(applePaySessionObj);
        expect(typeof applePaySessionObj.oncancel).toBe('function');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        applePaySessionObj.oncancel();
        expect(applePaySessionAbort).toBeCalledTimes(1);
    });

    test('called successfully phone not required', () => {
        ppcpOnClickApple(mouseEventMock);

        expect(preventDefaultMock).toBeCalledTimes(1);
        expect(getPPCPApplePayConfigCheckedMock).toBeCalledTimes(1);
        expect(getCurrencyMock).toBeCalledTimes(1);
        expect(getTotalsMock).toBeCalledTimes(1);
        expect(getOrderInitialDataMock).toBeCalledTimes(1);
        expect(getPaymentRequestDisplayItemMock).toBeCalledTimes(1);
        expect(applePaySessionMock).toBeCalledTimes(1);
        expect(applePaySessionMock).toBeCalledWith(
            paypalConstants.APPLEPAY_VERSION_NUMBER,
            applePaymentRequest
        );
        expect(typeof applePaySessionObj.oncancel).toBe('function');
        expect(applePaySessionObj.onvalidatemerchant).toBe(ppcpOnValidateMerchantApple);
        expect(applePaySessionObj.onshippingcontactselected).toBe(ppcpOnShippingContactSelectedApple);
        expect(applePaySessionObj.onshippingmethodselected).toBe(ppcpOnShippingMethodSelectedApple);
        // expect(applePaySessionObj.onpaymentauthorized).toBe(() => {/*TODO implement ppcpOnPaymentAuthorized*/});
        expect(applePaySessionBegin).toBeCalledTimes(1);
        expect(applePaySessionAbort).toBeCalledTimes(0);
        expect(setPPCPApplePaySessionMock).toBeCalledTimes(1);
        expect(setPPCPApplePaySessionMock).toBeCalledWith(applePaySessionObj);
    });

    test('called successfully phone required', () => {
        const {general_settings: generalSettings} = orderInitialDataMock;
        const {checkout_process: checkoutProcess} = generalSettings;
        const newGeneralSettings = {...generalSettings, checkout_process: {...checkoutProcess, phone_number_required: true}};
        const initialData: IOrderInitialData = {...orderInitialDataMock, general_settings: newGeneralSettings};
        const newApplePaymentRequest: ApplePayPaymentRequest = {...applePaymentRequest, requiredBillingContactFields: fieldsWithPhone, requiredShippingContactFields: fieldsWithPhone};

        getOrderInitialDataMock.mockReturnValueOnce(initialData);

        ppcpOnClickApple(mouseEventMock);

        expect(preventDefaultMock).toBeCalledTimes(1);
        expect(getPPCPApplePayConfigCheckedMock).toBeCalledTimes(1);
        expect(getCurrencyMock).toBeCalledTimes(1);
        expect(getTotalsMock).toBeCalledTimes(1);
        expect(getOrderInitialDataMock).toBeCalledTimes(1);
        expect(getPaymentRequestDisplayItemMock).toBeCalledTimes(1);
        expect(applePaySessionMock).toBeCalledTimes(1);
        expect(applePaySessionMock).toBeCalledWith(
            paypalConstants.APPLEPAY_VERSION_NUMBER,
            newApplePaymentRequest
        );
        expect(typeof applePaySessionObj.oncancel).toBe('function');
        expect(applePaySessionObj.onvalidatemerchant).toBe(ppcpOnValidateMerchantApple);
        expect(applePaySessionObj.onshippingcontactselected).toBe(ppcpOnShippingContactSelectedApple);
        expect(applePaySessionObj.onshippingmethodselected).toBe(ppcpOnShippingMethodSelectedApple);
        // expect(applePaySessionObj.onpaymentauthorized).toBe(() => {/*TODO implement ppcpOnPaymentAuthorized*/});
        expect(applePaySessionBegin).toBeCalledTimes(1);
        expect(applePaySessionAbort).toBeCalledTimes(0);
        expect(setPPCPApplePaySessionMock).toBeCalledTimes(1);
        expect(setPPCPApplePaySessionMock).toBeCalledWith(applePaySessionObj);
    });

    test('call with failure', () => {
        const error = new Error('Error Test!');
        getPPCPApplePayConfigCheckedMock.mockImplementationOnce(() => {
            throw error;
        });

        try {
            ppcpOnClickApple(mouseEventMock);
            expect('This expect should not run, call should Throw').toBe(null);
        } catch (e) {
            expect(e).toBe(error);
            expect(preventDefaultMock).toBeCalledTimes(1);
            expect(getPPCPApplePayConfigCheckedMock).toBeCalledTimes(1);
            expect(getCurrencyMock).toBeCalledTimes(0);
            expect(getTotalsMock).toBeCalledTimes(0);
            expect(getOrderInitialDataMock).toBeCalledTimes(0);
            expect(getPaymentRequestDisplayItemMock).toBeCalledTimes(0);
            expect(applePaySessionMock).toBeCalledTimes(0);
            expect(applePaySessionObj.oncancel).toBe(null);
            expect(applePaySessionObj.onvalidatemerchant).toBe(null);
            expect(applePaySessionObj.onshippingcontactselected).toBe(null);
            expect(applePaySessionObj.onshippingmethodselected).toBe(null);
            expect(applePaySessionObj.onpaymentauthorized).toBe(null);
            expect(applePaySessionBegin).toBeCalledTimes(0);
            expect(applePaySessionAbort).toBeCalledTimes(0);
            expect(setPPCPApplePaySessionMock).toBeCalledTimes(0);
        }
    });
});
