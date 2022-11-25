import mocked = jest.mocked;
import {getCurrency, getShipping} from '@bold-commerce/checkout-frontend-library';
import {currencyMock, shippingMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import {getBraintreeShippingOptionsGoogle} from 'src';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getShipping');
const getCurrencyMock = mocked(getCurrency, true);
const getShippingMock = mocked(getShipping, true);

describe('testing getBraintreeShippingOptionsGoogle function', () => {

    beforeEach(() => {
        getCurrencyMock.mockReturnValue(currencyMock);
    });

    test('testing getBraintreeShippingOptionsGoogle - successfully ',() => {

        const expected = {
            defaultSelectedOptionId: 'test_select_shipping_line_id',
            shippingOptions: [{
                description: '',
                id: 'test_select_shipping_line_id',
                label: '1.00: Test Description '
            }]
        };
        getShippingMock.mockReturnValue(shippingMock);
        const result = getBraintreeShippingOptionsGoogle();
        expect(result).toStrictEqual(expected);
    });

    test('testing getBraintreeShippingOptionsGoogle - with no shipping lines ',() => {

        const tempShippingMock = {...shippingMock, selected_shipping: undefined, available_shipping_lines: []};
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getShippingMock.mockReturnValue(tempShippingMock);
        const result = getBraintreeShippingOptionsGoogle();
        expect(result).toStrictEqual(undefined);
    });
});
