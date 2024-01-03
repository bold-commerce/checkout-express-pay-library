import {mocked} from 'jest-mock';
import {
    API_RETRY,
    braintreeOnShippingContactSelectedApple,
    callShippingAddressEndpoint,
    formatApplePayContactToCheckoutAddress,
    getBraintreeApplePaySessionChecked,
    getPaymentRequestDisplayItems
} from 'src';
import {
    baseReturnObject,
    estimateShippingLines,
    estimateTaxes,
    getApplicationState,
    getCurrency,
    getOrderInitialData,
    getShipping,
    getShippingLines,
    IOrderInitialData,
    IShipping,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import {
    addressesMock,
    applicationStateMock,
    currencyMock,
    orderInitialDataMock,
    shippingMock
} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import ApplePayShippingContactSelectedEvent = ApplePayJS.ApplePayShippingContactSelectedEvent;
import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;

jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/utils/callShippingAddressEndpoint');
jest.mock('src/utils/formatApplePayContactToCheckoutAddress');
jest.mock('src/utils/getPaymentRequestDisplayItems');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getApplicationState');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes/setTaxes');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping/getShippingLines');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getOrderInitialData');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes/estimateTaxes');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping/estimateShippingLines');
const getBraintreeApplePaySessionCheckedMock = mocked(getBraintreeApplePaySessionChecked, true);
const formatApplePayContactToCheckoutAddressMock = mocked(formatApplePayContactToCheckoutAddress, true);
const getPaymentRequestDisplayItemsMock = mocked(getPaymentRequestDisplayItems, true);
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);
const getCurrencyMock = mocked(getCurrency, true);
const getShippingMock = mocked(getShipping, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const setTaxesMock = mocked(setTaxes, true);
const getShippingLinesMock = mocked(getShippingLines, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const estimateShippingLinesMock = mocked(estimateShippingLines, true);
const estimateTaxesMock = mocked(estimateTaxes, true);

describe('testing braintreeOnShippingContactSelectedApple function',() => {
    const successReturn = {...baseReturnObject, success: true};
    const displayItemMock = [{label: 'Test Description', amount: 100}];
    const displayItemMappedMock = [{label: 'Test Description', amount: '1.00'}];
    const shippingMethodsMock = [{label: 'Test Description', detail: '', identifier: 'test_select_shipping_line_id', amount: '1.00'}];
    const addressContact: ApplePayPaymentContact = {
        givenName: 'John',
        familyName: 'Doe',
        phoneNumber: '1231231234',
        postalCode: 'R3Y0L6',
        locality: 'Winnipeg',
        addressLines: ['123 Any St', 'Line 2'],
        emailAddress: 'test@test.com',
        countryCode: 'CA',
        administrativeArea: 'MB'
    };
    const applePaySessionCompleteShippingContactSelection = jest.fn();
    const applePaySessionObj = {
        completeShippingContactSelection: applePaySessionCompleteShippingContactSelection
    } as unknown as ApplePaySession;
    const eventMock = {
        shippingContact: addressContact
    } as ApplePayShippingContactSelectedEvent;

    beforeEach(() => {
        jest.resetAllMocks();

        getBraintreeApplePaySessionCheckedMock.mockReturnValue(applePaySessionObj);
        getCurrencyMock.mockReturnValue(currencyMock);
        getShippingMock.mockReturnValue(shippingMock);
        getApplicationStateMock.mockReturnValue(applicationStateMock);
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve(successReturn));
        formatApplePayContactToCheckoutAddressMock.mockReturnValue(addressesMock.shipping);
        getShippingLinesMock.mockReturnValue(Promise.resolve(successReturn));
        setTaxesMock.mockReturnValue(Promise.resolve(successReturn));
        getPaymentRequestDisplayItemsMock.mockReturnValueOnce(displayItemMock);
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
        estimateShippingLinesMock.mockReturnValue(Promise.resolve(successReturn));
        estimateTaxesMock.mockReturnValue(Promise.resolve(successReturn));
    });

    test('call successfully without rsa',async () => {
        const expectedCompleteParam = {
            newLineItems: displayItemMappedMock,
            newShippingMethods: shippingMethodsMock,
            newTotal: {amount: '100.00', label: 'Total'}
        };

        await braintreeOnShippingContactSelectedApple(eventMock).then(() => {
            expect(getCurrencyMock).toBeCalledTimes(1);
            expect(getBraintreeApplePaySessionCheckedMock).toBeCalledTimes(1);
            expect(formatApplePayContactToCheckoutAddressMock).toBeCalledTimes(1);
            expect(formatApplePayContactToCheckoutAddressMock).toBeCalledWith(addressContact, true);
            expect(callShippingAddressEndpointMock).toBeCalledTimes(1);
            expect(callShippingAddressEndpointMock).toBeCalledWith(addressesMock.shipping, false);
            expect(getShippingLinesMock).toBeCalledTimes(1);
            expect(getShippingLinesMock).toBeCalledWith(API_RETRY);
            expect(setTaxesMock).toBeCalledTimes(1);
            expect(setTaxesMock).toBeCalledWith(API_RETRY);
            expect(getApplicationStateMock).toBeCalledTimes(1);
            expect(getPaymentRequestDisplayItemsMock).toBeCalledTimes(1);
            expect(getShippingMock).toBeCalledTimes(1);
            expect(applePaySessionCompleteShippingContactSelection).toBeCalledTimes(1);
            expect(applePaySessionCompleteShippingContactSelection).toBeCalledWith(expectedCompleteParam);
        });
    });

    test('call successfully with rsa',async () => {
        const expectedCompleteParam = {
            newLineItems: displayItemMappedMock,
            newShippingMethods: shippingMethodsMock,
            newTotal: {amount: '100.00', label: 'Total'}
        };

        const {general_settings: generalSettings} = orderInitialDataMock;
        const {checkout_process: checkoutProcess} = generalSettings;
        const newGeneralSettings = {...generalSettings, checkout_process: {...checkoutProcess, rsa_enabled: true}};
        const initialData: IOrderInitialData = {...orderInitialDataMock, general_settings: newGeneralSettings};
        getOrderInitialDataMock.mockReturnValue(initialData);
        getShippingMock.mockReturnValueOnce(
            {...shippingMock,
                selected_shipping: null,
                available_shipping_lines: [
                    {id: '1', description: 'option'}
                ]} as unknown as IShipping
        );

        await braintreeOnShippingContactSelectedApple(eventMock).then(() => {
            expect(getCurrencyMock).toBeCalledTimes(1);
            expect(getBraintreeApplePaySessionCheckedMock).toBeCalledTimes(1);
            expect(formatApplePayContactToCheckoutAddressMock).toBeCalledTimes(1);
            expect(formatApplePayContactToCheckoutAddressMock).toBeCalledWith(addressContact, true);
            expect(callShippingAddressEndpointMock).toBeCalledTimes(0);
            expect(estimateShippingLinesMock).toBeCalledTimes(1);
            expect(estimateTaxesMock).toBeCalledTimes(1);
            expect(getApplicationStateMock).toBeCalledTimes(1);
            expect(getPaymentRequestDisplayItemsMock).toBeCalledTimes(1);
            expect(getShippingMock).toBeCalledTimes(2);
            expect(applePaySessionCompleteShippingContactSelection).toBeCalledTimes(1);
            expect(applePaySessionCompleteShippingContactSelection).toBeCalledWith(expectedCompleteParam);
        });
    });

    const failureResponse = {...baseReturnObject, success: false};
    const failureData = [
        {
            name: 'Shipping Address without RSA',
            shippingAddressResp: failureResponse,
            shippingLinesResp: successReturn,
            setTaxesResp: successReturn,
            estimateShippingResp: successReturn,
            estimateTaxResp: successReturn,
            shippingLineTimes: 0,
            setTaxesTimes: 0,
            estimateShippingTimes: 0,
            estimateTaxTimes: 0,
            rsaEnabled: false,
            getShippingTimes: 0,
        }, {
            name: 'Shipping Lines without RSA',
            shippingAddressResp: successReturn,
            shippingLinesResp: failureResponse,
            setTaxesResp: successReturn,
            estimateShippingResp: successReturn,
            estimateTaxResp: successReturn,
            shippingLineTimes: 1,
            setTaxesTimes: 1,
            estimateShippingTimes: 0,
            estimateTaxTimes: 0,
            rsaEnabled: false,
            getShippingTimes: 0,
        }, {
            name: 'Set Taxes without RSA',
            shippingAddressResp: successReturn,
            shippingLinesResp: successReturn,
            setTaxesResp: failureResponse,
            estimateShippingResp: successReturn,
            estimateTaxResp: successReturn,
            shippingLineTimes: 1,
            setTaxesTimes: 1,
            estimateShippingTimes: 0,
            estimateTaxTimes: 0,
            rsaEnabled: false,
            getShippingTimes: 0,
        },
        {
            name: 'Estimate Shipping with RSA',
            shippingAddressResp: successReturn,
            shippingLinesResp: successReturn,
            setTaxesResp: successReturn,
            estimateShippingResp: failureResponse,
            estimateTaxResp: successReturn,
            shippingLineTimes: 0,
            setTaxesTimes: 0,
            estimateShippingTimes: 1,
            estimateTaxTimes: 1,
            rsaEnabled: true,
            getShippingTimes: 0,
        }, {
            name: 'Estimate tax with RSA',
            shippingAddressResp: successReturn,
            shippingLinesResp: successReturn,
            setTaxesResp: successReturn,
            estimateShippingResp: successReturn,
            estimateTaxResp: failureResponse,
            shippingLineTimes: 1,
            setTaxesTimes: 0,
            estimateShippingTimes: 1,
            estimateTaxTimes: 1,
            rsaEnabled: true,
            getShippingTimes: 1,
        }
    ];

    test.each(failureData)('call failure in $name response',async (
        {
            shippingAddressResp,
            shippingLinesResp,
            setTaxesResp,
            estimateShippingResp,
            estimateTaxResp,
            shippingLineTimes,
            setTaxesTimes,
            estimateShippingTimes,
            estimateTaxTimes,
            rsaEnabled,
            getShippingTimes
        }
    ) => {
        global.window.ApplePayError = Error;
        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(shippingAddressResp));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve(shippingLinesResp));
        setTaxesMock.mockReturnValueOnce(Promise.resolve(setTaxesResp));
        estimateShippingLinesMock.mockReturnValue(Promise.resolve(estimateShippingResp));
        estimateTaxesMock.mockReturnValue(Promise.resolve(estimateTaxResp));
        const expectedCompleteParam = {
            errors: [new Error('shippingContactInvalid')],
            newTotal: {amount: '100.00', label: 'Total'}
        };

        if (rsaEnabled) {
            const {general_settings: generalSettings} = orderInitialDataMock;
            const {checkout_process: checkoutProcess} = generalSettings;
            const newGeneralSettings = {...generalSettings, checkout_process: {...checkoutProcess, rsa_enabled: true}};
            const initialData: IOrderInitialData = {...orderInitialDataMock, general_settings: newGeneralSettings};
            getOrderInitialDataMock.mockReturnValue(initialData);
        }

        await braintreeOnShippingContactSelectedApple(eventMock).then(() => {
            expect(getCurrencyMock).toBeCalledTimes(1);
            expect(getBraintreeApplePaySessionCheckedMock).toBeCalledTimes(1);
            expect(formatApplePayContactToCheckoutAddressMock).toBeCalledTimes(1);
            expect(formatApplePayContactToCheckoutAddressMock).toBeCalledWith(addressContact, true);
            if (!rsaEnabled) {
                expect(callShippingAddressEndpointMock).toBeCalledTimes(1);
                expect(callShippingAddressEndpointMock).toBeCalledWith(addressesMock.shipping, false);
            }
            expect(getShippingLinesMock).toBeCalledTimes(shippingLineTimes);
            expect(setTaxesMock).toBeCalledTimes(setTaxesTimes);
            expect(estimateShippingLinesMock).toBeCalledTimes(estimateShippingTimes);
            expect(estimateTaxesMock).toBeCalledTimes(estimateTaxTimes);
            expect(getApplicationStateMock).toBeCalledTimes(1);
            expect(getPaymentRequestDisplayItemsMock).toBeCalledTimes(0);
            expect(getShippingMock).toBeCalledTimes(getShippingTimes);
            expect(applePaySessionCompleteShippingContactSelection).toBeCalledTimes(1);
            expect(applePaySessionCompleteShippingContactSelection).toBeCalledWith(expectedCompleteParam);
        });
    });
});
