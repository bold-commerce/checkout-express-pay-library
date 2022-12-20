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
            firstName: 'first',
            lastName: 'last',
            addressLine1: 'test_address_line_1',
            addressLine2: 'test_address_line_2',
            city: 'test_city',
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
            validateAddressParamsExpected: {arg1: 'first', arg2: 'last', arg3: 'test_address_line_1', arg4:'test_address_line_2', arg5:'test_city', arg6: 'm1m1m1', arg7: province.name, arg8: province.iso_code, arg9: country.name, arg10: country.iso_code},
            expectedResp: true
        },
        {
            name: 'Invalid address with province',
            getCountryProvinceResp: {country, province},
            firstName: 'first',
            lastName: 'last',
            addressLine1: 'test_address_line_1',
            addressLine2: 'test_address_line_2',
            city: 'test_city',
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
            validateAddressParamsExpected: {arg1: 'first', arg2: 'last', arg3: 'test_address_line_1', arg4:'test_address_line_2', arg5:'test_city', arg6: 'm1m1m1', arg7: province.name, arg8: province.iso_code, arg9: country.name, arg10: country.iso_code},
            expectedResp: false
        },
        {
            name: 'Valid address without province',
            getCountryProvinceResp: {country: {...country, show_province: false}, province: undefined},
            firstName: 'first',
            lastName: 'last',
            addressLine1: 'test_address_line_1',
            addressLine2: 'test_address_line_2',
            city: 'test_city',
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
            validateAddressParamsExpected: {arg1: 'first', arg2: 'last', arg3: 'test_address_line_1', arg4:'test_address_line_2', arg5:'test_city', arg6: 'm1m1m1', arg7: '', arg8: '', arg9: country.name, arg10: country.iso_code},
            expectedResp: true
        },
        {
            name: 'Invalid address without province',
            getCountryProvinceResp: {country: {...country, show_province: false}, province: undefined},
            firstName: 'first',
            lastName: 'last',
            addressLine1: 'test_address_line_1',
            addressLine2: 'test_address_line_2',
            city: 'test_city',
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
            validateAddressParamsExpected: {arg1: 'first', arg2: 'last', arg3: 'test_address_line_1', arg4:'test_address_line_2', arg5:'test_city', arg6: 'm1m1m1', arg7: '', arg8: '', arg9: country.name, arg10: country.iso_code},
            expectedResp: false
        },
    ];

    test.each(dataWithApi)('Testing isAddressValid dataset when API call happens', async (
        {getCountryProvinceResp, firstName, lastName, addressLine1, addressLine2, city, postalCode, countryKey, provinceKey, type, validateAddressParamsExpected, expectedResp}
    ) => {
        const {arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10} = validateAddressParamsExpected;
        validateAddressMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: expectedResp}));
        getCountryAndProvinceMock.mockReturnValueOnce(getCountryProvinceResp);

        const result = await isAddressValid(firstName, lastName, addressLine1, addressLine2, city, postalCode, countryKey, provinceKey, type as 'shipping'|'billing');

        expect(result).toBe(expectedResp);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith(countryKey, provinceKey);
        expect(validateAddressMock).toHaveBeenCalledTimes(1);
        expect(validateAddressMock).toHaveBeenCalledWith(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, '', '', API_RETRY);
    });

    const dataWithoutApi = [
        {
            name: 'Without country',
            getCountryProvinceResp: {country: undefined, province},
            firstName: 'first',
            lastName: 'last',
            addressLine1: 'test_address_line_1',
            addressLine2: 'test_address_line_2',
            city: 'test_city',
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
        },
        {
            name: 'Country Invalid for shipping',
            getCountryProvinceResp: {country: {...country, valid_for_shipping: false}, province},
            firstName: 'first',
            lastName: 'last',
            addressLine1: 'test_address_line_1',
            addressLine2: 'test_address_line_2',
            city: 'test_city',
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
        },
        {
            name: 'Country Invalid for billing',
            getCountryProvinceResp: {country: {...country, valid_for_billing: false}, province},
            firstName: 'first',
            lastName: 'last',
            addressLine1: 'test_address_line_1',
            addressLine2: 'test_address_line_2',
            city: 'test_city',
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'billing',
        },
        {
            name: 'Without province',
            getCountryProvinceResp: {country, province: undefined},
            firstName: 'first',
            lastName: 'last',
            addressLine1: 'test_address_line_1',
            addressLine2: 'test_address_line_2',
            city: 'test_city',
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
        },
        {
            name: 'Province invalid for shipping',
            getCountryProvinceResp: {country, province: {...province, valid_for_shipping: false}},
            firstName: 'first',
            lastName: 'last',
            addressLine1: 'test_address_line_1',
            addressLine2: 'test_address_line_2',
            city: 'test_city',
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'shipping',
        },
        {
            name: 'Province invalid for shipping',
            getCountryProvinceResp: {country, province: {...province, valid_for_billing: false}},
            firstName: 'first',
            lastName: 'last',
            addressLine1: 'test_address_line_1',
            addressLine2: 'test_address_line_2',
            city: 'test_city',
            countryKey: 'test_country_iso_code',
            provinceKey: 'test_province_iso_code',
            postalCode: 'm1m1m1',
            type: 'billing',
        },
    ];

    test.each(dataWithoutApi)('Testing isAddressValid dataset when false before API', async (
        {getCountryProvinceResp, firstName, lastName, addressLine1, addressLine2, city, postalCode, countryKey, provinceKey, type}
    ) => {
        getCountryAndProvinceMock.mockReturnValueOnce(getCountryProvinceResp);

        const result = await isAddressValid(firstName, lastName, addressLine1, addressLine2, city, postalCode, countryKey, provinceKey, type as 'shipping'|'billing');

        expect(result).toBe(false);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith(countryKey, provinceKey);
        expect(validateAddressMock).toHaveBeenCalledTimes(0);
    });

});
