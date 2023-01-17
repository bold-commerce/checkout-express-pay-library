import {
    checkStripeAddress,
    formatStripeShippingAddress,
    getPaymentRequestDisplayItems,
    getPhoneNumber,
    IStripeAddress
} from 'src';
import {mocked} from 'jest-mock';
import {applicationStateMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import {
    baseReturnObject,
    getApplicationState,
    getShipping,
    getShippingLines,
    IApplicationState,
    IShipping,
    setShippingAddress,
    setTaxes
} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/stripe/formatStripeShippingAddress');
jest.mock('@bold-commerce/checkout-frontend-library/lib/address');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('@bold-commerce/checkout-frontend-library/lib/shipping');
jest.mock('@bold-commerce/checkout-frontend-library/lib/taxes');
jest.mock('src/utils/getPaymentRequestDisplayItems');
jest.mock('src/utils/getPhoneNumber');
const formatStripeAddressMock = mocked(formatStripeShippingAddress, true);
const setShippingAddressMock = mocked(setShippingAddress, true);
const getApplicationStateMock = mocked(getApplicationState, true);
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
        getApplicationStateMock.mockReturnValue({order_total: orderTotal} as IApplicationState);
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
