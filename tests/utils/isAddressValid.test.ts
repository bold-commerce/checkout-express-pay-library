import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    ICountryInformation,
    IProvince,
    validateAddress
} from '@bold-commerce/checkout-frontend-library';
import {getCountryAndProvince, getPhoneNumber, isAddressValid} from 'src/utils';
import {API_RETRY} from 'src';

jest.mock('@bold-commerce/checkout-frontend-library/lib/address/validateAddress');
jest.mock('src/utils/getCountryAndProvince');
jest.mock('src/utils/getPhoneNumber');
const getCountryAndProvinceMock = mocked(getCountryAndProvince, true);
const validateAddressMock = mocked(validateAddress, true);
const getPhoneNumberMock = mocked(getPhoneNumber, true);

describe('testing getCountryName function', () => {
    const province: IProvince = {
        iso_code: 'test_province_iso_code',
        name: 'test_name_province',
        valid_for_shipping: true,
        valid_for_billing: true,
    };
    const country: ICountryInformation = {
        iso_code: 'test_country_iso_code',
        name: 'test_name',
        show_province: true,
        province_label: 'test_province_label',
        show_postal_code: true,
        provinces: [province],
        valid_for_shipping: true,
        valid_for_billing: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getCountryAndProvinceMock.mockReturnValue({country, province});
        validateAddressMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        getPhoneNumberMock.mockReturnValue('');
    });

    const dataWithApi = [
        {
            name: 'Valid address with province',
            getCountryProvinceResp: {country, province},
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
            validateAddressParamsExpected: {arg1: 'm1m1m1', arg2: province.name, arg3: province.iso_code, arg4: country.name, arg5: country.iso_code},
            expectedResp: true
        },
        {
            name: 'Invalid address with province',
            getCountryProvinceResp: {country, province},
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
            validateAddressParamsExpected: {arg1: 'm1m1m1', arg2: province.name, arg3: province.iso_code, arg4: country.name, arg5: country.iso_code},
            expectedResp: false
        },
        {
            name: 'Valid address without province',
            getCountryProvinceResp: {country: {...country, show_province: false}, province: undefined},
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
            validateAddressParamsExpected: {arg1: 'm1m1m1', arg2: '', arg3: '', arg4: country.name, arg5: country.iso_code},
            expectedResp: true
        },
        {
            name: 'Invalid address without province',
            getCountryProvinceResp: {country: {...country, show_province: false}, province: undefined},
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
            validateAddressParamsExpected: {arg1: 'm1m1m1', arg2: '', arg3: '', arg4: country.name, arg5: country.iso_code},
            expectedResp: false
        },
    ];

    test.each(dataWithApi)('Testing isAddressValid dataset when API call happens', async (
        {getCountryProvinceResp, countryKey, provinceKey, postalCode, type, validateAddressParamsExpected, expectedResp}
    ) => {
        const {arg1, arg2, arg3, arg4, arg5} = validateAddressParamsExpected;
        validateAddressMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: expectedResp}));
        getCountryAndProvinceMock.mockReturnValueOnce(getCountryProvinceResp);

        const result = await isAddressValid(countryKey, provinceKey, postalCode, type as 'shipping'|'billing');

        expect(result).toBe(expectedResp);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith(countryKey, provinceKey);
        expect(validateAddressMock).toHaveBeenCalledTimes(1);
        expect(validateAddressMock).toHaveBeenCalledWith(arg1, arg2, arg3, arg4, arg5, '', '', API_RETRY);
    });

    const dataWithoutApi = [
        {
            name: 'Without country',
            getCountryProvinceResp: {country: undefined, province},
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
        },
        {
            name: 'Country Invalid for shipping',
            getCountryProvinceResp: {country: {...country, valid_for_shipping: false}, province},
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
        },
        {
            name: 'Country Invalid for billing',
            getCountryProvinceResp: {country: {...country, valid_for_billing: false}, province},
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'billing',
        },
        {
            name: 'Without province',
            getCountryProvinceResp: {country, province: undefined},
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
        },
        {
            name: 'Province invalid for shipping',
            getCountryProvinceResp: {country, province: {...province, valid_for_shipping: false}},
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
        },
        {
            name: 'Province invalid for shipping',
            getCountryProvinceResp: {country, province: {...province, valid_for_billing: false}},
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'billing',
        },
    ];

    test.each(dataWithoutApi)('Testing isAddressValid dataset when false before API', async (
        {getCountryProvinceResp, countryKey, provinceKey, postalCode, type}
    ) => {
        getCountryAndProvinceMock.mockReturnValueOnce(getCountryProvinceResp);

        const result = await isAddressValid(countryKey, provinceKey, postalCode, type as 'shipping'|'billing');

        expect(result).toBe(false);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith(countryKey, provinceKey);
        expect(validateAddressMock).toHaveBeenCalledTimes(0);
    });

});
