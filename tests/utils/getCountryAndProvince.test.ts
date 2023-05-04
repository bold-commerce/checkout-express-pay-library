import {mocked} from 'jest-mock';
import {
    getOrderInitialData,
    ICountryInformation,
    IOrderInitialData,
    IProvince,
} from '@boldcommerce/checkout-frontend-library';
import {getCountryAndProvince} from 'src/utils';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getOrderInitialData');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);

describe('testing getCountryName function', () => {
    const province: IProvince = {
        iso_code: 'test_province_iso_code',
        name: 'test_name_province',
        valid_for_shipping: true,
        valid_for_billing: true,
    };
    const country: ICountryInformation = {
        iso_code: 'test_country_iso_code',
        name: 'test_name_country',
        show_province: true,
        province_label: 'test_province_label',
        show_postal_code: true,
        provinces: [province],
        valid_for_shipping: true,
        valid_for_billing: true,
    };
    const countryNoProvinces: ICountryInformation = {
        iso_code: 'test_country_iso_code',
        name: 'test_name_country',
        show_province: true,
        province_label: 'test_province_label',
        show_postal_code: true,
        provinces: [],
        valid_for_shipping: true,
        valid_for_billing: true,
    };
    const initialData = {country_info:[country]} as IOrderInitialData;
    const initialDataNoProvinces = {country_info:[countryNoProvinces]} as IOrderInitialData;

    beforeEach(() => {
        jest.clearAllMocks();
        getOrderInitialDataMock.mockReturnValue(initialData);
    });

    const dataWithApi = [
        {
            name: 'Find Country and Province by name',
            initialDataResp: initialData,
            countryKey: 'test_name_country',
            provinceKey: 'test_name_province',
            expectedResp: {country, province}
        },
        {
            name: 'Find Country and do not find province by name',
            initialDataResp: initialData,
            countryKey: 'test_name_country',
            provinceKey: 'invalid_test_name_province',
            expectedResp: {country, province: undefined}
        },
        {
            name: 'Find Country and Province by iso',
            initialDataResp: initialData,
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            expectedResp: {country, province}
        },
        {
            name: 'Find Country and do not find province by iso',
            initialDataResp: initialData,
            countryKey: 'test_country_iso_code',
            provinceKey: 'invalid_test_province_iso_code',
            expectedResp: {country, province: undefined}
        },
        {
            name: 'Find Country with no provinces',
            initialDataResp: initialDataNoProvinces,
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            expectedResp: {country: countryNoProvinces, province: undefined}
        },
        {
            name: 'Do not find province or country',
            initialDataResp: initialData,
            countryKey: 'invalid_test_country_iso_code',
            provinceKey: 'invalid_test_province_iso_code',
            expectedResp: {country: undefined, province: undefined}
        },
    ];

    test.each(dataWithApi)('Testing isAddressValid dataset when API call happens', (
        {initialDataResp, countryKey, provinceKey, expectedResp}
    ) => {
        getOrderInitialDataMock.mockReturnValueOnce(initialDataResp);

        const result = getCountryAndProvince(countryKey, provinceKey);

        expect(result).toStrictEqual(expectedResp);
        expect(getOrderInitialDataMock).toHaveBeenCalledTimes(1);
    });

});
