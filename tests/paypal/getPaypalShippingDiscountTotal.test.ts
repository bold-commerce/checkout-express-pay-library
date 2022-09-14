import {getCurrency, getShipping} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {currencyMock, shippingMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getPaypalShippingDiscountTotal, getValueByCurrency} from 'src';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('src/utils/getValueByCurrency');
const getCurrencyMock = mocked(getCurrency, true);
const getShippingMock = mocked(getShipping, true);
const getValueByCurrencyMock = mocked(getValueByCurrency, true);

describe('testing getPaypalShippingDiscountTotal function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        getShippingMock.mockReturnValue(shippingMock);
        getValueByCurrencyMock.mockReturnValue('0.01');
    });

    test('testing call getPaypalShippingDiscountTotal', async () => {
        const expectation: AmountWithCurrencyCode = {
            currency_code: 'USD',
            value: '0.01',
        };

        const result = getPaypalShippingDiscountTotal();

        expect(result).toStrictEqual(expectation);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledWith(1, expectation.currency_code);
    });

});
