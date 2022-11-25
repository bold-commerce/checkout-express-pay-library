import {mocked} from 'jest-mock';
import {
    API_RETRY,
    braintreeOnShippingContactSelectedApple,
    callShippingAddressEndpoint,
    formatBraintreeShippingAddressApple,
    getBraintreeApplePaySessionChecked,
    getPaymentRequestDisplayItems
} from 'src';
import {
    baseReturnObject,
    getApplicationState,
    getCurrency,
    getShipping,
    getShippingLines,
    setTaxes
} from '@bold-commerce/checkout-frontend-library';
import {
    addressesMock,
    applicationStateMock,
    currencyMock,
    shippingMock
} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import ApplePayShippingContactSelectedEvent = ApplePayJS.ApplePayShippingContactSelectedEvent;
import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;

jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/braintree/apple/formatBraintreeShippingAddressApple');
jest.mock('src/utils/getPaymentRequestDisplayItems');
jest.mock('src/utils/callShippingAddressEndpoint');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getApplicationState');
jest.mock('@bold-commerce/checkout-frontend-library/lib/taxes/setTaxes');
jest.mock('@bold-commerce/checkout-frontend-library/lib/shipping/getShippingLines');
const getBraintreeApplePaySessionCheckedMock = mocked(getBraintreeApplePaySessionChecked, true);
const formatBraintreeShippingAddressAppleMock = mocked(formatBraintreeShippingAddressApple, true);
const getPaymentRequestDisplayItemsMock = mocked(getPaymentRequestDisplayItems, true);
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);
const getCurrencyMock = mocked(getCurrency, true);
const getShippingMock = mocked(getShipping, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const setTaxesMock = mocked(setTaxes, true);
const getShippingLinesMock = mocked(getShippingLines, true);

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
        formatBraintreeShippingAddressAppleMock.mockReturnValue(addressesMock.shipping);
        getShippingLinesMock.mockReturnValue(Promise.resolve(successReturn));
        setTaxesMock.mockReturnValue(Promise.resolve(successReturn));
        getPaymentRequestDisplayItemsMock.mockReturnValueOnce(displayItemMock);
    });

    test('call successfully',async () => {
        const expectedCompleteParam = {
            newLineItems: displayItemMappedMock,
            newShippingMethods: shippingMethodsMock,
            newTotal: {amount: '100.00', label: 'Total'}
        };

        await braintreeOnShippingContactSelectedApple(eventMock).then(() => {
            expect(getCurrencyMock).toBeCalledTimes(1);
            expect(getBraintreeApplePaySessionCheckedMock).toBeCalledTimes(1);
            expect(formatBraintreeShippingAddressAppleMock).toBeCalledTimes(1);
            expect(formatBraintreeShippingAddressAppleMock).toBeCalledWith(addressContact);
            expect(callShippingAddressEndpointMock).toBeCalledTimes(1);
            expect(callShippingAddressEndpointMock).toBeCalledWith(addressesMock.shipping, true);
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

    const failureResponse = {...baseReturnObject, success: false};
    const failureData = [
        {
            name: 'Shipping Address',
            shippingAddressResp: failureResponse,
            shippingLinesResp: successReturn,
            setTaxesResp: successReturn,
            shippingLineTimes: 0,
            setTaxesTimes: 0
        }, {
            name: 'Shipping Lines',
            shippingAddressResp: successReturn,
            shippingLinesResp: failureResponse,
            setTaxesResp: successReturn,
            shippingLineTimes: 1,
            setTaxesTimes: 1
        }, {
            name: 'Set Taxes',
            shippingAddressResp: successReturn,
            shippingLinesResp: successReturn,
            setTaxesResp: failureResponse,
            shippingLineTimes: 1,
            setTaxesTimes: 1
        },
    ];

    test.each(failureData)('call failure in $name response',async (
        {
            shippingAddressResp,
            shippingLinesResp,
            setTaxesResp,
            shippingLineTimes,
            setTaxesTimes
        }
    ) => {
        global.window.ApplePayError = Error;
        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(shippingAddressResp));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve(shippingLinesResp));
        setTaxesMock.mockReturnValueOnce(Promise.resolve(setTaxesResp));
        const expectedCompleteParam = {
            errors: [new Error('shippingContactInvalid')],
            newTotal: {amount: '100.00', label: 'Total'}
        };

        await braintreeOnShippingContactSelectedApple(eventMock).then(() => {
            expect(getCurrencyMock).toBeCalledTimes(1);
            expect(getBraintreeApplePaySessionCheckedMock).toBeCalledTimes(1);
            expect(formatBraintreeShippingAddressAppleMock).toBeCalledTimes(1);
            expect(formatBraintreeShippingAddressAppleMock).toBeCalledWith(addressContact);
            expect(callShippingAddressEndpointMock).toBeCalledTimes(1);
            expect(callShippingAddressEndpointMock).toBeCalledWith(addressesMock.shipping, true);
            expect(getShippingLinesMock).toBeCalledTimes(shippingLineTimes);
            expect(setTaxesMock).toBeCalledTimes(setTaxesTimes);
            expect(getApplicationStateMock).toBeCalledTimes(1);
            expect(getPaymentRequestDisplayItemsMock).toBeCalledTimes(0);
            expect(getShippingMock).toBeCalledTimes(0);
            expect(applePaySessionCompleteShippingContactSelection).toBeCalledTimes(1);
            expect(applePaySessionCompleteShippingContactSelection).toBeCalledWith(expectedCompleteParam);
        });
    });
});
