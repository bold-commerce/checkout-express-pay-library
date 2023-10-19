import {mocked} from 'jest-mock';
import {
    API_RETRY,
    braintreeConstants,
    braintreeOnPaymentDataChangeGoogle,
    callShippingAddressEndpoint,
    formatBraintreeShippingAddressGoogle,
    getBraintreeShippingOptionsGoogle,
} from 'src';
import {
    baseReturnObject,
    changeShippingLine,
    getApplicationState,
    getCurrency,
    getShipping,
    getShippingLines,
    setTaxes,
    IApiReturnObject,
    IShipping
} from '@boldcommerce/checkout-frontend-library';
import {
    addressesMock,
    applicationStateMock,
    currencyMock,
    shippingMock
} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import IntermediatePaymentData = google.payments.api.IntermediatePaymentData;
import IntermediateAddress = google.payments.api.IntermediateAddress;

jest.mock('src/braintree/google/formatBraintreeShippingAddressGoogle');
jest.mock('src/braintree/google/getBraintreeShippingOptionsGoogle');
jest.mock('src/utils/getPaymentRequestDisplayItems');
jest.mock('src/utils/callShippingAddressEndpoint');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getApplicationState');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes/setTaxes');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping/getShippingLines');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping/changeShippingLine');
const getBraintreeShippingOptionsGoogleMock = mocked(getBraintreeShippingOptionsGoogle, true);
const formatBraintreeShippingAddressGoogleMock = mocked(formatBraintreeShippingAddressGoogle, true);
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);
const getCurrencyMock = mocked(getCurrency, true);
const getShippingMock = mocked(getShipping, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const setTaxesMock = mocked(setTaxes, true);
const getShippingLinesMock = mocked(getShippingLines, true);
const changeShippingLineMock = mocked(changeShippingLine, true);

describe('testing braintreeOnPaymentDataChangeGoogle function',() => {
    const successReturn = {...baseReturnObject, success: true};
    const shippingMethodsMock = [{label: '1.00: Test Description', description: '', id: 'test_select_shipping_line_id'}];
    const shippingOptionsGoogleMock = {shippingOptions: shippingMethodsMock, defaultSelectedOptionId: 'test_select_shipping_line_id'};
    const addressContact: IntermediateAddress = {
        postalCode: 'R3Y0L6',
        locality: 'Winnipeg',
        countryCode: 'CA',
        administrativeArea: 'MB'
    };
    const shippingOptionData = {id: 'test_select_shipping_line_id'};
    const intermediatePaymentData = {
        callbackTrigger: braintreeConstants.GOOGLEPAY_TRIGGER_INITIALIZE,
        shippingAddress: addressContact,
        shippingOptionData : shippingOptionData
    } as IntermediatePaymentData;

    beforeEach(() => {
        jest.resetAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        getShippingMock.mockReturnValue(shippingMock);
        getApplicationStateMock.mockReturnValue(applicationStateMock);
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve(successReturn));
        formatBraintreeShippingAddressGoogleMock.mockReturnValue(addressesMock.shipping);
        getShippingLinesMock.mockReturnValue(Promise.resolve(successReturn));
        setTaxesMock.mockReturnValue(Promise.resolve(successReturn));
        getBraintreeShippingOptionsGoogleMock.mockReturnValueOnce(shippingOptionsGoogleMock);
    });

    test('call successfully default trigger',async () => {
        const param = {...intermediatePaymentData, callbackTrigger: ''} as unknown as IntermediatePaymentData;

        const result = await braintreeOnPaymentDataChangeGoogle(param);

        expect(result).toStrictEqual({});
        expect(formatBraintreeShippingAddressGoogleMock).toBeCalledTimes(0);
        expect(callShippingAddressEndpointMock).toBeCalledTimes(0);
        expect(getShippingLinesMock).toBeCalledTimes(0);
        expect(getShippingMock).toBeCalledTimes(0);
        expect(changeShippingLineMock).toBeCalledTimes(0);
        expect(setTaxesMock).toBeCalledTimes(0);
        expect(getCurrencyMock).toBeCalledTimes(0);
        expect(getApplicationStateMock).toBeCalledTimes(0);
        expect(getBraintreeShippingOptionsGoogleMock).toBeCalledTimes(0);
    });

    const triggerData = [
        {
            case: 'GOOGLEPAY_TRIGGER_INITIALIZE',
            callbackTrigger: braintreeConstants.GOOGLEPAY_TRIGGER_INITIALIZE,
            selected: shippingMock.selected_shipping,
            option: shippingOptionData
        }, {
            case: 'GOOGLEPAY_INTENT_SHIPPING_OPTION',
            callbackTrigger: braintreeConstants.GOOGLEPAY_INTENT_SHIPPING_OPTION,
            selected: shippingMock.selected_shipping,
            option: shippingOptionData
        }, {
            case: 'GOOGLEPAY_INTENT_SHIPPING_ADDRESS',
            callbackTrigger: braintreeConstants.GOOGLEPAY_INTENT_SHIPPING_ADDRESS,
            selected: shippingMock.selected_shipping,
            option: shippingOptionData
        }, {
            case: 'No option, no selected option and GOOGLEPAY_INTENT_SHIPPING_ADDRESS',
            callbackTrigger: braintreeConstants.GOOGLEPAY_INTENT_SHIPPING_ADDRESS,
            selected: null,
            option: null
        },
    ];
    test.each(triggerData)('call successfully $case trigger',async ({callbackTrigger,selected, option}) => {
        const newShippingMock = {...shippingMock, selected_shipping: selected} as IShipping;
        getShippingMock.mockReturnValueOnce(newShippingMock);
        const param = {...intermediatePaymentData, shippingOptionData: option, callbackTrigger: callbackTrigger} as unknown as IntermediatePaymentData;
        const expectedResult = {
            newShippingOptionParameters: shippingOptionsGoogleMock,
            newTransactionInfo: {currencyCode: 'USD', totalPrice: '100.00', totalPriceStatus: 'ESTIMATED'}
        };

        const result = await braintreeOnPaymentDataChangeGoogle(param);

        expect(result).toStrictEqual(expectedResult);
        expect(formatBraintreeShippingAddressGoogleMock).toBeCalledTimes(1);
        expect(formatBraintreeShippingAddressGoogleMock).toBeCalledWith(addressContact, true);
        expect(callShippingAddressEndpointMock).toBeCalledTimes(1);
        expect(callShippingAddressEndpointMock).toBeCalledWith(addressesMock.shipping, true);
        expect(getShippingLinesMock).toBeCalledTimes(2);
        expect(getShippingLinesMock).toBeCalledWith(API_RETRY);
        expect(getShippingMock).toBeCalledTimes(1);
        expect(changeShippingLineMock).toBeCalledTimes(1);
        expect(changeShippingLineMock).toBeCalledWith('test_select_shipping_line_id', API_RETRY);
        expect(setTaxesMock).toBeCalledTimes(1);
        expect(setTaxesMock).toBeCalledWith(API_RETRY);
        expect(getCurrencyMock).toBeCalledTimes(1);
        expect(getApplicationStateMock).toBeCalledTimes(1);
        expect(getBraintreeShippingOptionsGoogleMock).toBeCalledTimes(1);
    });

    const errorMsg = 'Test Error';
    const failureData = [
        {name: 'call failure shipping address response null error', error: null, message: ''},
        {name: 'call failure shipping address response filled error', error: new Error(errorMsg), message: errorMsg},
    ];
    test.each(failureData)('$name',async ({error, message}) => {
        const failureResponse = {...baseReturnObject, success: false, error: error} as IApiReturnObject;
        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(failureResponse));
        const expectedResult = {
            error: {
                reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_SHIPPING,
                message: message,
                intent: braintreeConstants.GOOGLEPAY_INTENT_SHIPPING_ADDRESS
            },
        };

        const result = await braintreeOnPaymentDataChangeGoogle(intermediatePaymentData);

        expect(result).toStrictEqual(expectedResult);
        expect(formatBraintreeShippingAddressGoogleMock).toBeCalledTimes(1);
        expect(formatBraintreeShippingAddressGoogleMock).toBeCalledWith(addressContact, true);
        expect(callShippingAddressEndpointMock).toBeCalledTimes(1);
        expect(callShippingAddressEndpointMock).toBeCalledWith(addressesMock.shipping, true);
        expect(getShippingLinesMock).toBeCalledTimes(0);
        expect(getShippingMock).toBeCalledTimes(0);
        expect(changeShippingLineMock).toBeCalledTimes(0);
        expect(setTaxesMock).toBeCalledTimes(0);
        expect(getCurrencyMock).toBeCalledTimes(0);
        expect(getApplicationStateMock).toBeCalledTimes(0);
        expect(getBraintreeShippingOptionsGoogleMock).toBeCalledTimes(0);
    });
});
