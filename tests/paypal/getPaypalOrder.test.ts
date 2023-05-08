import {getPublicOrderId} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {AmountWithBreakdown, AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getPaypalAmountWithBreakdown, getPaypalOrder, getPaypalPurchaseItems} from 'src';
import {CreateOrderRequestBody, PurchaseItem} from '@paypal/paypal-js/types/apis/orders';

jest.mock('@boldcommerce/checkout-frontend-library/lib/auth/getPublicOrderId');
jest.mock('src/paypal/getPaypalAmountWithBreakdown');
jest.mock('src/paypal/getPaypalPurchaseItems');
const getPublicOrderIdMock = mocked(getPublicOrderId, true);
const getPaypalAmountWithBreakdownMock = mocked(getPaypalAmountWithBreakdown, true);
const getPaypalPurchaseItemsMock = mocked(getPaypalPurchaseItems, true);

describe('testing getPaypalOrder function', () => {
    const publicOrderId = 'abc123';
    const breakdownItemMock: AmountWithCurrencyCode = {
        currency_code: 'USD',
        value: '0.00',
    };
    const breakdownItem100Mock: AmountWithCurrencyCode = {
        currency_code: 'USD',
        value: '100.00',
    };

    const amountWithBreakdownMock: AmountWithBreakdown = {
        currency_code: 'USD',
        value: '100.00',
        breakdown: {
            item_total: breakdownItem100Mock,
            shipping: breakdownItemMock,
            tax_total: breakdownItemMock,
            discount: breakdownItemMock,
            shipping_discount: breakdownItemMock,
        }
    };
    const itemsMock: Array<PurchaseItem> = [
        {
            name: 'Some Name',
            quantity: '1',
            unit_amount: breakdownItem100Mock
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        getPublicOrderIdMock.mockReturnValue(publicOrderId);
        getPaypalAmountWithBreakdownMock.mockReturnValue(amountWithBreakdownMock);
        getPaypalPurchaseItemsMock.mockReturnValue(itemsMock);
    });

    test('testing call getPaypalOrder', async () => {
        const expectation: CreateOrderRequestBody = {
            purchase_units: [{
                custom_id: publicOrderId,
                amount: amountWithBreakdownMock,
                items: itemsMock
            }]
        };
        const result = getPaypalOrder();

        expect(result).toStrictEqual(expectation);
        expect(getPublicOrderIdMock).toHaveBeenCalledTimes(1);
        expect(getPaypalAmountWithBreakdownMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPurchaseItemsMock).toHaveBeenCalledTimes(1);
    });

});
