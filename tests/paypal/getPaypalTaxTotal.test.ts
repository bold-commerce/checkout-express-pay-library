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
    const taxesArrayNotIncludedMock: Array<ITax> = [{value: 1234, name: 'test_tax_name_not_included', is_included: false}];
    const taxesArrayIsIncludedMock: Array<ITax> = [{value: 1234, name: 'test_tax_name_is_included', is_included: true}];
    const taxesArrayPartialIsIncludedMock: Array<ITax> = [
        {value: 1234, name: 'test_tax_name_is_included', is_included: true},
        {value: 1235, name: 'test_tax_name_is_included', is_included: false},
    ];

    const expectation: AmountWithCurrencyCode = {
        currency_code: 'USD',
        value: '12.34',
    };
    const dataSet = [
        {name: 'tax not included', data: taxesArrayNotIncludedMock, expected: {currency_code: 'USD', value: 1234}},
        {name: 'tax is included', data: taxesArrayIsIncludedMock, expected: {currency_code: 'USD', value: 0}},
        {name: 'tax with partial is included', data: taxesArrayPartialIsIncludedMock, expected: {currency_code: 'USD', value: 1235}},
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        getValueByCurrencyMock.mockReturnValue('12.34');
    });

    test.each(dataSet)('$name', ({ data, expected}) => {

        getTaxesMock.mockReturnValueOnce(data);
        const result = getPaypalTaxTotal();

        expect(result).toStrictEqual(expectation);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getTaxesMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledWith(expected.value, expected.currency_code);
    });

});
