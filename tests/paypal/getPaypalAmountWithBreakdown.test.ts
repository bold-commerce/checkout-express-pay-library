import {getApplicationState, getCurrency} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {applicationStateMock, currencyMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import {
    getPaypalAmountWithBreakdown,
    getPaypalDiscountTotal,
    getPaypalItemsTotal,
    getPaypalShippingDiscountTotal,
    getPaypalShippingTotal,
    getPaypalTaxTotal,
    getValueByCurrency
} from 'src';
import {AmountWithBreakdown, AmountWithCurrencyCode} from '@paypal/paypal-js';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getApplicationState');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('src/paypal/getPaypalDiscountTotal');
jest.mock('src/paypal/getPaypalItemsTotal');
jest.mock('src/paypal/getPaypalShippingDiscountTotal');
jest.mock('src/paypal/getPaypalShippingTotal');
jest.mock('src/paypal/getPaypalTaxTotal');
jest.mock('src/utils/getValueByCurrency');
const getApplicationStateMock = mocked(getApplicationState, true);
const getCurrencyMock = mocked(getCurrency, true);
const getPaypalDiscountTotalMock = mocked(getPaypalDiscountTotal, true);
const getPaypalItemsTotalMock = mocked(getPaypalItemsTotal, true);
const getPaypalShippingDiscountTotalMock = mocked(getPaypalShippingDiscountTotal, true);
const getPaypalShippingTotalMock = mocked(getPaypalShippingTotal, true);
const getPaypalTaxTotalMock = mocked(getPaypalTaxTotal, true);
const getValueByCurrencyMock = mocked(getValueByCurrency, true);

describe('testing getPaypalAmountWithBreakdown function', () => {
    const breakdownItemMock: AmountWithCurrencyCode = {
        currency_code: 'USD',
        value: '0.00',
    };
    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        getApplicationStateMock.mockReturnValue(applicationStateMock);
        getPaypalDiscountTotalMock.mockReturnValue(breakdownItemMock);
        getPaypalItemsTotalMock.mockReturnValue(breakdownItemMock);
        getPaypalShippingDiscountTotalMock.mockReturnValue(breakdownItemMock);
        getPaypalShippingTotalMock.mockReturnValue(breakdownItemMock);
        getPaypalTaxTotalMock.mockReturnValue(breakdownItemMock);
        getValueByCurrencyMock.mockReturnValue('100.00');
    });

    test('testing call getPaypalAmountWithBreakdown', async () => {
        const expectation: AmountWithBreakdown = {
            currency_code: 'USD',
            value: '100.00',
            breakdown: {
                item_total: breakdownItemMock,
                shipping: breakdownItemMock,
                tax_total: breakdownItemMock,
                discount: breakdownItemMock,
                shipping_discount: breakdownItemMock,
            }
        };
        const result = getPaypalAmountWithBreakdown();

        expect(result).toStrictEqual(expectation);
        expect(getApplicationStateMock).toHaveBeenCalledTimes(1);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
    });

});
