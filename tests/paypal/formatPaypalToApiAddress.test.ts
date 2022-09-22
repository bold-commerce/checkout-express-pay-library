import {formatPaypalToApiAddress, getCountryAndProvince} from 'src';
import {ICountryInformation, IProvince, ISetShippingAddressRequest} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {ShippingAddress} from '@paypal/paypal-js/types/apis/shipping';

jest.mock('src/utils/getCountryAndProvince');
const getCountryAndProvinceMock = mocked(getCountryAndProvince, true);

describe('testing  formatPaypalToApiAddress function', () => {
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
    const paypalAddress: ShippingAddress = {
        city: 'Test City',
        state: 'test_province_iso_code',
        country_code: 'test_country_iso_code',
        postal_code: 'M1M1M1',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getCountryAndProvinceMock.mockReturnValue({country, province});
    });

    test('testing call formatPaypalToApiAddress country and province found', async () => {
        const expected: ISetShippingAddressRequest = {
            address_line_1: '',
            address_line_2: '',
            business_name: '',
            city: 'Test City',
            country: 'test_name_country',
            country_code: 'test_country_iso_code',
            first_name: '',
            last_name: '',
            phone_number: '',
            postal_code: 'M1M1M1',
            province: 'test_name_province',
            province_code: 'test_province_iso_code'
        };

        const result = formatPaypalToApiAddress(paypalAddress);

        expect(result).toStrictEqual(expected);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith(paypalAddress.country_code, paypalAddress.state);
    });

    test('testing call formatPaypalToApiAddress country and province not found', async () => {
        getCountryAndProvinceMock.mockReturnValueOnce({country: undefined, province: undefined});
        const expected: ISetShippingAddressRequest = {
            address_line_1: '',
            address_line_2: '',
            business_name: '',
            city: 'Test City',
            country: '',
            country_code: '',
            first_name: '',
            last_name: '',
            phone_number: '',
            postal_code: 'M1M1M1',
            province: '',
            province_code: ''
        };

        const result = formatPaypalToApiAddress(paypalAddress);

        expect(result).toStrictEqual(expected);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith(paypalAddress.country_code, paypalAddress.state);
    });

    test('testing call formatPaypalToApiAddress address null values', async () => {
        getCountryAndProvinceMock.mockReturnValueOnce({country: undefined, province: undefined});
        const expected: ISetShippingAddressRequest = {
            address_line_1: '',
            address_line_2: '',
            business_name: '',
            city: '',
            country: '',
            country_code: '',
            first_name: '',
            last_name: '',
            phone_number: '',
            postal_code: '',
            province: '',
            province_code: ''
        };

        const result = formatPaypalToApiAddress(
            {city: '', state: null, country_code: null, postal_code: ''} as unknown as ShippingAddress
        );

        expect(result).toStrictEqual(expected);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith('', '');
    });

    test('testing call formatPaypalToApiAddress address undefined', async () => {
        getCountryAndProvinceMock.mockReturnValueOnce({country: undefined, province: undefined});
        const expected: ISetShippingAddressRequest = {
            address_line_1: '',
            address_line_2: '',
            business_name: '',
            city: '',
            country: '',
            country_code: '',
            first_name: '',
            last_name: '',
            phone_number: '',
            postal_code: '',
            province: '',
            province_code: ''
        };

        const result = formatPaypalToApiAddress(undefined);

        expect(result).toStrictEqual(expected);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith('', '');
    });

});
