import {getCurrency, getFees, getLineItems, ILineItem} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {currencyMock, feesMock, lineItemMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import {getPaypalPurchaseItems, getValueByCurrency} from 'src';
import {PurchaseItem} from '@paypal/paypal-js/types/apis/orders';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getFees');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getLineItems');
jest.mock('src/utils/getValueByCurrency');
const getCurrencyMock = mocked(getCurrency, true);
const getFeesMock = mocked(getFees, true);
const getLineItemsMock = mocked(getLineItems, true);
const getValueByCurrencyMock = mocked(getValueByCurrency, true);

describe('testing getPaypalPurchaseItems function', () => {
    const breakdownItem10Mock: AmountWithCurrencyCode = {
        currency_code: 'USD',
        value: '10.00',
    };
    const breakdownItem12Mock: AmountWithCurrencyCode = {
        currency_code: 'USD',
        value: '12.00',
    };
    const secondLineItemMock: ILineItem = {
        ...lineItemMock,
        product_data: {
            ...lineItemMock.product_data,
            requires_shipping: false
        }
    };
    const itemMock: PurchaseItem = {
        category: 'PHYSICAL_GOODS',
        description: 'Product Title - Product Description',
        name: 'title x 1',
        quantity: '1',
        sku: 'test_sku',
        unit_amount: breakdownItem10Mock
    };
    const secondItemMock: PurchaseItem = {
        ...itemMock,
        category: 'DIGITAL_GOODS',
    };
    const feeItemMock: PurchaseItem = {
        category: 'DIGITAL_GOODS',
        description: '',
        name: ' Some Fee Description',
        quantity: '1',
        unit_amount: breakdownItem12Mock
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        getFeesMock.mockReturnValue([feesMock]);
        getLineItemsMock.mockReturnValue([lineItemMock, secondLineItemMock]);
        getValueByCurrencyMock
            .mockReturnValueOnce('10.00')
            .mockReturnValueOnce('10.00')
            .mockReturnValueOnce('12.00');
    });

    test('testing call getPaypalPurchaseItems', async () => {
        const expectation: Array<PurchaseItem> = [itemMock, secondItemMock, feeItemMock];

        const result = getPaypalPurchaseItems();

        expect(result).toStrictEqual(expectation);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getFeesMock).toHaveBeenCalledTimes(1);
        expect(getLineItemsMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledTimes(3);
    });

});
