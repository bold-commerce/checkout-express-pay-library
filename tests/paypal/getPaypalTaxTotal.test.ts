import {getCurrency, getTaxes, ITax} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {currencyMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getPaypalTaxTotal, getValueByCurrency} from 'src';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getTaxes');
jest.mock('src/utils/getValueByCurrency');
const getCurrencyMock = mocked(getCurrency, true);
const getTaxesMock = mocked(getTaxes, true);
const getValueByCurrencyMock = mocked(getValueByCurrency, true);

describe('testing getPaypalTaxTotal function', () => {
    const taxesArrayMock: Array<ITax> = [
        {
            value: 0,
            name: 'test_tax_name_included',
            is_included: true
        },
        {
            value: 1234,
            name: 'test_tax_name',
            is_included: false
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        getTaxesMock.mockReturnValue(taxesArrayMock);
        getValueByCurrencyMock.mockReturnValue('12.34');
    });

    test('testing call getPaypalTaxTotal', async () => {
        const expectation: AmountWithCurrencyCode = {
            currency_code: 'USD',
            value: '12.34',
        };

        const result = getPaypalTaxTotal();

        expect(result).toStrictEqual(expectation);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getTaxesMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledWith(1234, expectation.currency_code);
    });

});
