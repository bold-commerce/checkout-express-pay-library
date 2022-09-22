import {
    getPaypalShippingOptions,
    getValueByCurrency
} from 'src';
import {mocked} from 'jest-mock';
import {getCurrency, getShipping} from '@bold-commerce/checkout-frontend-library';
import {currencyMock, shippingMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('src/utils/getValueByCurrency');
const getCurrencyMock = mocked(getCurrency, true);
const getShippingMock = mocked(getShipping, true);
const getValueByCurrencyMock = mocked(getValueByCurrency, true);

describe('testing  getPaypalShippingOptions function', () => {
    const extraAvailableShipping = {
        id: `test_select_shipping_line_id_2_${'-'.repeat(130)}`,
        description: `Test Description 2 ${'-'.repeat(130)}`,
        amount: 100
    };
    const shippingReturnMock = {
        ...shippingMock,
        available_shipping_lines: [...shippingMock.available_shipping_lines, extraAvailableShipping]
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        getShippingMock.mockReturnValue(shippingReturnMock);
        getValueByCurrencyMock.mockReturnValue('1.00');
    });

    test('testing call getPaypalShippingOptions less then maximum list options', async () => {
        const expected = [
            {
                amount: {currency_code: 'USD', value: '1.00'},
                id: 'test_select_shipping_line_id',
                label: 'Test Description',
                selected: true,
                type: 'SHIPPING'
            },
            {
                amount: {currency_code: 'USD' , value: '1.00'},
                id: 'test_select_shipping_line_id_2_------------------------------------------------------------------------------------------------',
                label: 'Test Description 2 ------------------------------------------------------------------------------------------------------------',
                selected: false,
                type: 'SHIPPING'
            }];

        const result = getPaypalShippingOptions();

        expect(result).toStrictEqual(expected);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledTimes(2);
    });

    test('testing call getPaypalShippingOptions exceed maximum list options', async () => {
        const shippingReturn12Mock = {
            ...shippingMock,
            available_shipping_lines: [
                ...shippingMock.available_shipping_lines,
                extraAvailableShipping,
                extraAvailableShipping,
                extraAvailableShipping,
                extraAvailableShipping,
                extraAvailableShipping,
                extraAvailableShipping,
                extraAvailableShipping,
                extraAvailableShipping,
                extraAvailableShipping,
                extraAvailableShipping,
                extraAvailableShipping,
            ]
        };
        const unselectedOption = {
            amount: {currency_code: 'USD' , value: '1.00'},
            id: 'test_select_shipping_line_id_2_------------------------------------------------------------------------------------------------',
            label: 'Test Description 2 ------------------------------------------------------------------------------------------------------------',
            selected: false,
            type: 'SHIPPING'
        };
        const expected = [
            {
                amount: {currency_code: 'USD', value: '1.00'},
                id: 'test_select_shipping_line_id',
                label: 'Test Description',
                selected: true,
                type: 'SHIPPING'
            },
            {...unselectedOption},
            {...unselectedOption},
            {...unselectedOption},
            {...unselectedOption},
            {...unselectedOption},
            {...unselectedOption},
            {...unselectedOption},
            {...unselectedOption},
            {...unselectedOption},
        ];
        getShippingMock.mockReturnValueOnce(shippingReturn12Mock);

        const result = getPaypalShippingOptions();

        expect(result).toStrictEqual(expected);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getValueByCurrencyMock).toHaveBeenCalledTimes(12);
    });

});
