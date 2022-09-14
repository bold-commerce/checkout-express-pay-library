import {getCurrency, getDiscounts} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {currencyMock, discountMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getPaypalDiscountTotal, getValueByCurrency} from 'src';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getDiscounts');
jest.mock('src/utils/getValueByCurrency');
const getCurrencyMock = mocked(getCurrency, true);
const getDiscountsMock = mocked(getDiscounts, true);
const getValueByCurrencyMock = mocked(getValueByCurrency, true);

describe('testing getPaypalDiscountTotal function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        getDiscountsMock.mockReturnValue([discountMock]);
        getValueByCurrencyMock.mockReturnValue('0.01');
    });

    test('testing call getPaypalDiscountTotal', async () => {
        const expectation: AmountWithCurrencyCode = {
            currency_code: 'USD',
            value: '0.01',
        };

        const result = getPaypalDiscountTotal();

        expect(result).toStrictEqual(expectation);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getDiscountsMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledWith(1, expectation.currency_code);
    });

});
