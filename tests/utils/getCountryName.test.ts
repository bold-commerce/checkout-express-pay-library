import {mocked} from 'jest-mock';
import {getOrderInitialData, ICountryInformation, IOrderInitialData} from '@bold-commerce/checkout-frontend-library';
import {getCountryName} from 'src/utils';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);

describe('testing getCountryName function', () => {

    const country: Array<ICountryInformation> = [{
        iso_code: 'test_iso_code',
        name: 'test_name',
        show_province: true,
        province_label: 'test_province_label',
        show_postal_code: true,
        provinces: [],
        valid_for_shipping: true,
        valid_for_billing: true,
    }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [
        {name: 'successfully found the country name', iso_code: 'test_iso_code', expected: 'test_name'},
        {name: 'fail to find the country name', iso_code: 'test', expected: ''}
    ];

    test.each(data)('$name', async ({iso_code, expected}) => {
        getOrderInitialDataMock.mockReturnValueOnce({country_info:country} as IOrderInitialData);
        const result = getCountryName(iso_code);
        expect(result).toBe(expected);
    });

});
