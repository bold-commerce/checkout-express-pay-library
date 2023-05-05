import {getPaypalAmountWithBreakdown, getPaypalPatchOperations, getPaypalShippingOptions} from 'src';
import {mocked} from 'jest-mock';
import {getShipping} from '@boldcommerce/checkout-frontend-library';
import {shippingMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {IShipping} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('src/paypal/getPaypalAmountWithBreakdown');
jest.mock('src/paypal/getPaypalShippingOptions');
const getShippingMock = mocked(getShipping, true);
const getPaypalAmountWithBreakdownMock = mocked(getPaypalAmountWithBreakdown, true);
const getPaypalShippingOptionsMock = mocked(getPaypalShippingOptions, true);

describe('testing  getPaypalPatchOperations function', () => {
    const paypalShippingOptions = [{
        amount: {currency_code: 'CAD', value: '1.00'},
        id: 'test_select_shipping_line_id',
        label: 'Test Description',
        selected: true,
        type: 'SHIPPING'}];
    const paypalAmountWithBreakdown = {
        breakdown: {
            discount: {currency_code: 'CAD', value: '0.00'},
            item_total: {currency_code: 'CAD', value: '0.00'},
            shipping: {currency_code: 'CAD', value: '1.00'},
            shipping_discount: {currency_code: 'CAD', value: '0.01'},
            tax_total: {currency_code: 'CAD', value: '0.00'}
        },
        currency_code: 'CAD',
        value: '0.00'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getShippingMock.mockReturnValue(shippingMock);
        getPaypalAmountWithBreakdownMock.mockReturnValue(paypalAmountWithBreakdown);
        getPaypalShippingOptionsMock.mockReturnValue(paypalShippingOptions);
    });

    test('testing call getPaypalPatchOperations hasOptionSelected true', async () => {
        const expected = [
            {
                op: 'replace',
                path: '/purchase_units/@reference_id==\'default\'/amount',
                value: paypalAmountWithBreakdown
            },
            {
                op: 'replace',
                path: '/purchase_units/@reference_id==\'default\'/shipping/options',
                value: paypalShippingOptions
            }
        ];
        const result = getPaypalPatchOperations(true);

        expect(result).toStrictEqual(expected);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(getPaypalAmountWithBreakdownMock).toHaveBeenCalledTimes(1);
        expect(getPaypalShippingOptionsMock).toHaveBeenCalledTimes(1);
    });

    test('testing call getPaypalPatchOperations hasOptionSelected false', async () => {
        const expected = [
            {
                op: 'replace',
                path: '/purchase_units/@reference_id==\'default\'/amount',
                value: paypalAmountWithBreakdown
            },
            {
                op: 'add',
                path: '/purchase_units/@reference_id==\'default\'/shipping/options',
                value: paypalShippingOptions
            }
        ];
        const result = getPaypalPatchOperations(false);

        expect(result).toStrictEqual(expected);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(getPaypalAmountWithBreakdownMock).toHaveBeenCalledTimes(1);
        expect(getPaypalShippingOptionsMock).toHaveBeenCalledTimes(1);
    });

    test('testing call getPaypalPatchOperations with no shipping lines', async () => {
        getShippingMock.mockReturnValueOnce({...shippingMock, available_shipping_lines: []});
        const expected = [
            {
                op: 'replace',
                path: '/purchase_units/@reference_id==\'default\'/amount',
                value: paypalAmountWithBreakdown
            }
        ];
        const result = getPaypalPatchOperations(false);

        expect(result).toStrictEqual(expected);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(getPaypalAmountWithBreakdownMock).toHaveBeenCalledTimes(1);
        expect(getPaypalShippingOptionsMock).toHaveBeenCalledTimes(0);
    });

    test('testing call getPaypalPatchOperations with shipping lines undefined', async () => {
        getShippingMock.mockReturnValueOnce({...shippingMock, available_shipping_lines: undefined} as unknown as IShipping);
        const expected = [
            {
                op: 'replace',
                path: '/purchase_units/@reference_id==\'default\'/amount',
                value: paypalAmountWithBreakdown
            }
        ];
        const result = getPaypalPatchOperations(false);

        expect(result).toStrictEqual(expected);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(getPaypalAmountWithBreakdownMock).toHaveBeenCalledTimes(1);
        expect(getPaypalShippingOptionsMock).toHaveBeenCalledTimes(0);
    });

});
