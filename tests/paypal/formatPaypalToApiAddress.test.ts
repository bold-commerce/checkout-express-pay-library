import {formatPaypalToApiAddress, getCountryAndProvince} from 'src';
import {ICountryInformation, IProvince, ISetShippingAddressRequest} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {ShippingAddress} from '@paypal/paypal-js/types/apis/shipping';
import {Address} from '@paypal/paypal-js/types/apis/commons';

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
    const paypalShippingAddress: ShippingAddress = {
        city: 'Test City',
        state: 'test_province_iso_code',
        country_code: 'test_country_iso_code',
        postal_code: 'M1M1M1',
    };
    const paypalAddress: Address = {
        address_line_1: 'Test Line 1',
        address_line_2: 'Test Line 2',
        admin_area_1: 'test_province_iso_code',
        admin_area_2: 'Test City',
        country_code: 'test_country_iso_code',
        postal_code: 'M1M1M1'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getCountryAndProvinceMock.mockReturnValue({country, province});
    });

    test('paypal ShippingAddress country and province found', async () => {
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

        const result = formatPaypalToApiAddress(paypalShippingAddress);

        expect(result).toStrictEqual(expected);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith(paypalShippingAddress.country_code, paypalShippingAddress.state);
    });

    test('paypal ShippingAddress country and province not found', async () => {
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

        const result = formatPaypalToApiAddress(paypalShippingAddress);

        expect(result).toStrictEqual(expected);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith(paypalShippingAddress.country_code, paypalShippingAddress.state);
    });

    test('paypal ShippingAddress address null values', async () => {
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

    test('paypal Address with names and phone, country and province found', async () => {
        const expected: ISetShippingAddressRequest = {
            address_line_1: 'Test Line 1',
            address_line_2: 'Test Line 2',
            business_name: '',
            city: 'Test City',
            country: 'test_name_country',
            country_code: 'test_country_iso_code',
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '0000000000',
            postal_code: 'M1M1M1',
            province: 'test_name_province',
            province_code: 'test_province_iso_code'
        };

        const result = formatPaypalToApiAddress(paypalAddress, 'John', 'Doe', '0000000000');

        expect(result).toStrictEqual(expected);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith(paypalAddress.country_code, paypalAddress.admin_area_1);
    });

    test('paypal Address country and province not found', async () => {
        getCountryAndProvinceMock.mockReturnValueOnce({country: undefined, province: undefined});
        const expected: ISetShippingAddressRequest = {
            address_line_1: 'Test Line 1',
            address_line_2: 'Test Line 2',
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
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith(paypalAddress.country_code, paypalAddress.admin_area_1);
    });

    test('paypal ShippingAddress address null values', async () => {
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
            {
                address_line_1: null,
                address_line_2: null,
                admin_area_1: null,
                admin_area_2: null,
                postal_code: null,
                country_code: null
            } as unknown as Address
        );

        expect(result).toStrictEqual(expected);
        expect(getCountryAndProvinceMock).toHaveBeenCalledTimes(1);
        expect(getCountryAndProvinceMock).toHaveBeenCalledWith('', '');
    });

    test('paypal address undefined', async () => {
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
