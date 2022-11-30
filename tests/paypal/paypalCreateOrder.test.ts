import {getPaypalOrder, paypalCreateOrder} from 'src';
import {CreateOrderActions} from '@paypal/paypal-js/types/components/buttons';
import {AmountWithBreakdown, AmountWithCurrencyCode} from '@paypal/paypal-js';
import {CreateOrderRequestBody, PurchaseItem} from '@paypal/paypal-js/types/apis/orders';
import {mocked} from 'jest-mock';

jest.mock('src/paypal/getPaypalOrder');
const getPaypalOrderMock = mocked(getPaypalOrder, true);
const createOrderActionMock: CreateOrderActions = {order: {create: jest.fn()}};

describe('testing  paypalCreateOrder function', () => {
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
    const paypalOrderMock: CreateOrderRequestBody = {
        purchase_units: [{
            custom_id: publicOrderId,
            amount: amountWithBreakdownMock,
            items: itemsMock
        }]
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getPaypalOrderMock.mockReturnValue(paypalOrderMock);
    });

    test('testing call paypalCreateOrder success', async () => {
        await paypalCreateOrder({paymentSource: 'paypal'}, createOrderActionMock);

        expect(getPaypalOrderMock).toHaveBeenCalledTimes(1);
        expect(createOrderActionMock.order.create).toHaveBeenCalledTimes(1);
        expect(createOrderActionMock.order.create).toHaveBeenCalledWith(paypalOrderMock);

    });

});
