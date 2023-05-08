import {getCurrency, getLineItems} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {currencyMock, lineItemMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getPaypalItemsTotal, getValueByCurrency} from 'src';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getLineItems');
jest.mock('src/utils/getValueByCurrency');
const getCurrencyMock = mocked(getCurrency, true);
const getLineItemsMock = mocked(getLineItems, true);
const getValueByCurrencyMock = mocked(getValueByCurrency, true);

describe('testing getPaypalItemsTotal function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        getLineItemsMock.mockReturnValue([lineItemMock]);
        getValueByCurrencyMock.mockReturnValue('10.00');
    });

    test('testing call getPaypalItemsTotal', async () => {
        const expectation: AmountWithCurrencyCode = {
            currency_code: 'USD',
            value: '10.00',
        };

        const result = getPaypalItemsTotal();

        expect(result).toStrictEqual(expectation);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getLineItemsMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledWith(1000, expectation.currency_code);
    });

});
