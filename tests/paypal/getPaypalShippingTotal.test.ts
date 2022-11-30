import {getCurrency, getShipping} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {currencyMock, shippingMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getPaypalShippingTotal, getValueByCurrency} from 'src';
import {IShipping} from '@bold-commerce/checkout-frontend-library/lib/types/apiInterfaces';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('src/utils/getValueByCurrency');
const getCurrencyMock = mocked(getCurrency, true);
const getShippingMock = mocked(getShipping, true);
const getValueByCurrencyMock = mocked(getValueByCurrency, true);

describe('testing getPaypalShippingTotal function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        getShippingMock.mockReturnValue(shippingMock);
        getValueByCurrencyMock.mockReturnValue('1.00');
    });

    test('testing call getPaypalShippingTotal success', async () => {
        const expectation: AmountWithCurrencyCode = {
            currency_code: 'USD',
            value: '1.00',
        };

        const result = getPaypalShippingTotal();

        expect(result).toStrictEqual(expectation);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledWith(100, expectation.currency_code);
    });

    test('testing call getPaypalShippingTotal selectedShipping null', async () => {
        getShippingMock.mockReturnValueOnce({...shippingMock, selected_shipping: null} as unknown as IShipping);
        getValueByCurrencyMock.mockReturnValueOnce('0.00');
        const expectation: AmountWithCurrencyCode = {
            currency_code: 'USD',
            value: '0.00',
        };

        const result = getPaypalShippingTotal();

        expect(result).toStrictEqual(expectation);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledWith(0, expectation.currency_code);
    });

});
