import {getOrderInitialData, ICountryInformation, IOrderInitialData} from '@boldcommerce/checkout-frontend-library';
import {getProvinceDetails} from 'src/utils';
import {mocked} from 'jest-mock';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);

describe('testing getProvinceDetails function', () => {

    const country: Array<ICountryInformation> = [{
        iso_code: 'test_iso_code',
        name: 'test_name',
        show_province: true,
        province_label: 'test_province_label',
        show_postal_code: true,
        provinces: [{
            iso_code: 'test_province',
            name: 'test_name_province',
            valid_for_shipping: true,
            valid_for_billing: true,
        }],
        valid_for_shipping: true,
        valid_for_billing: true,
    }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [
        {name: 'successfully found the province', iso_code: 'test_iso_code', state: 'test_province', expected: {code:'test_province', name: 'test_name_province'}},
        {name: 'fail to find the country', iso_code: 'test_iso_code', state: 'invalid_province', expected: {code: '', name: ''}},
        {name: 'fail to find the province', iso_code: 'invalid_iso_code', state: 'test_province', expected: {code: '', name: ''}}
    ];

    test.each(data)('$name', async ({iso_code, state, expected}) => {
        getOrderInitialDataMock.mockReturnValueOnce({country_info:country} as IOrderInitialData);
        const result = getProvinceDetails(iso_code, state);
        expect(result).toStrictEqual(expected);
    });

});
