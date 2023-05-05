import {
    checkStripeAddress,
    formatStripeShippingAddress,
    getPaymentRequestDisplayItems,
    getPhoneNumber, getTotals,
    IStripeAddress, ITotals
} from 'src';
import {mocked} from 'jest-mock';
import {applicationStateMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {
    baseReturnObject,
    getShipping,
    getShippingLines,
    IShipping,
    setShippingAddress,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/stripe/formatStripeShippingAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/address');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes');
jest.mock('src/utils/getPaymentRequestDisplayItems');
jest.mock('src/utils/getPhoneNumber');
jest.mock('src/utils/getTotals');
const formatStripeAddressMock = mocked(formatStripeShippingAddress, true);
const setShippingAddressMock = mocked(setShippingAddress, true);
const getTotalsMock = mocked(getTotals, true);
const getShippingMock = mocked(getShipping, true);
const getShippingLinesMock = mocked(getShippingLines, true);
const setTaxesMock = mocked(setTaxes, true);
const getPaymentRequestDisplayItemMock = mocked(getPaymentRequestDisplayItems, true);
const getPhoneNumberMock = mocked(getPhoneNumber, true);

describe('testing check address function', () => {
    const successReturnObject = {...baseReturnObject, success: true};
    const failureReturnObject = {...baseReturnObject};
    const orderTotal = 200;
    const updateWithMock = jest.fn();
    const shippingLine = [{
        amount: 100,
        id: 'test_select_shipping_line_id',
        description: 'Test Description',
    }];
    const displayItemMock = [{label: 'test', amount: 1200}];
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: orderTotal,
        totalAmountDue: orderTotal,
        totalPaid: 0,
        totalFees: 1200,
        totalTaxes: 0,
        totalDiscounts: 1,
        totalAdditionalFees: 0
    };

    const data = [
        {name: 'success', setShipping: successReturnObject, getShippingLines: successReturnObject, setTaxes: successReturnObject, getShipping: shippingLine, expected: {total: {label: 'Total', amount: orderTotal}, status: 'success', shippingOptions: [{amount: 100, id: 'test_select_shipping_line_id', label: 'Test Description',}], displayItems: displayItemMock}},
        {name: 'success with empty shipping lines', setShipping: successReturnObject, getShippingLines: successReturnObject, setTaxes: successReturnObject, getShipping:[], expected:{status:'invalid_shipping_address'}},
        {name: 'success with failed taxes call', setShipping: successReturnObject, getShippingLines: successReturnObject, setTaxes: failureReturnObject, getShipping: shippingLine, expected:{status:'invalid_shipping_address'}},
        {name: 'success with failed shipping lines call', setShipping: successReturnObject, getShippingLines: failureReturnObject, setTaxes: successReturnObject, getShipping: shippingLine, expected:{status:'invalid_shipping_address'}},
        {name: 'failure', setShipping: failureReturnObject, getShippingLines: failureReturnObject, setTaxes: successReturnObject, getShipping: shippingLine, expected:{status:'invalid_shipping_address'}}
    ];


    beforeEach(() => {
        jest.clearAllMocks();
        formatStripeAddressMock.mockReturnValue(applicationStateMock.addresses.shipping);
        getTotalsMock.mockReturnValue(totals);
        getPaymentRequestDisplayItemMock.mockReturnValueOnce(displayItemMock);
        getPhoneNumberMock.mockReturnValue('');
    });

    test.each(data)('$name', async ({setShipping, getShippingLines, setTaxes, getShipping, expected}) => {
        getShippingMock.mockReturnValueOnce({available_shipping_lines: getShipping} as IShipping);
        setShippingAddressMock.mockReturnValueOnce(Promise.resolve(setShipping));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve(getShippingLines));
        setTaxesMock.mockReturnValueOnce(Promise.resolve(setTaxes));

        await checkStripeAddress({shippingAddress: {} as IStripeAddress, updateWith: updateWithMock});

        expect(updateWithMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toBeCalledWith(expected);
    });

});
