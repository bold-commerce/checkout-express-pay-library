import {mocked} from 'jest-mock';
import {
    API_RETRY,
    ppcpOnShippingMethodSelectedApple,
    getPPCPApplePaySessionChecked,
    getPaymentRequestDisplayItems
} from 'src';
import {
    baseReturnObject,
    changeShippingLine,
    getApplicationState,
    getCurrency,
    getShipping,
    getShippingLines,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import ApplePayShippingMethodSelectedEvent = ApplePayJS.ApplePayShippingMethodSelectedEvent;
import {applicationStateMock, currencyMock, shippingMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('src/paypal/managePaypalState');
jest.mock('src/utils/getPaymentRequestDisplayItems');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getApplicationState');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes/setTaxes');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping/getShippingLines');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping/changeShippingLine');
const getPPCPApplePaySessionCheckedMock = mocked(getPPCPApplePaySessionChecked, true);
const getPaymentRequestDisplayItemsMock = mocked(getPaymentRequestDisplayItems, true);
const changeShippingLineMock = mocked(changeShippingLine, true);
const getCurrencyMock = mocked(getCurrency, true);
const getShippingMock = mocked(getShipping, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const setTaxesMock = mocked(setTaxes, true);
const getShippingLinesMock = mocked(getShippingLines, true);

describe('testing ppcpOnShippingMethodSelectedApple function',() => {
    const successReturn = {...baseReturnObject, success: true};
    const displayItemMock = [{label: 'Test Description', amount: 100}];
    const displayItemMappedMock = [{label: 'Test Description', amount: '1.00'}];
    const applePaySessionCompleteShippingMethodSelection = jest.fn();
    const applePaySessionObj = {
        completeShippingMethodSelection: applePaySessionCompleteShippingMethodSelection
    } as unknown as ApplePaySession;
    const eventMock = {
        shippingMethod: {
            label: 'Test Description',
            detail: '',
            identifier: 'test_select_shipping_line_id',
            amount: '1.00'
        }
    } as ApplePayShippingMethodSelectedEvent;

    beforeEach(() => {
        jest.resetAllMocks();
        getPPCPApplePaySessionCheckedMock.mockReturnValue(applePaySessionObj);
        getCurrencyMock.mockReturnValue(currencyMock);
        getShippingMock.mockReturnValue(shippingMock);
        getApplicationStateMock.mockReturnValue(applicationStateMock);
        changeShippingLineMock.mockReturnValue(Promise.resolve(successReturn));
        getShippingLinesMock.mockReturnValue(Promise.resolve(successReturn));
        setTaxesMock.mockReturnValue(Promise.resolve(successReturn));
        getPaymentRequestDisplayItemsMock.mockReturnValueOnce(displayItemMock);
    });

    test('call successfully',async () => {
        const expectedCompleteParam = {
            newLineItems: displayItemMappedMock,
            newTotal: {amount: '100.00', label: 'Total'}
        };

        await ppcpOnShippingMethodSelectedApple(eventMock).then(() => {
            expect(getCurrencyMock).toBeCalledTimes(1);
            expect(getPPCPApplePaySessionCheckedMock).toBeCalledTimes(1);
            expect(getShippingMock).toBeCalledTimes(1);
            expect(changeShippingLineMock).toBeCalledTimes(1);
            expect(changeShippingLineMock).toBeCalledWith('test_select_shipping_line_id', API_RETRY);
            expect(getShippingLinesMock).toBeCalledTimes(1);
            expect(getShippingLinesMock).toBeCalledWith(API_RETRY);
            expect(setTaxesMock).toBeCalledTimes(1);
            expect(setTaxesMock).toBeCalledWith(API_RETRY);
            expect(getApplicationStateMock).toBeCalledTimes(1);
            expect(getPaymentRequestDisplayItemsMock).toBeCalledTimes(1);
            expect(applePaySessionCompleteShippingMethodSelection).toBeCalledTimes(1);
            expect(applePaySessionCompleteShippingMethodSelection).toBeCalledWith(expectedCompleteParam);

        });
    });
});
