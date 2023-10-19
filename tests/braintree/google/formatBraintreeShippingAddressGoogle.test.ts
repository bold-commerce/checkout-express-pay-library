import IntermediateAddress = google.payments.api.IntermediateAddress;
import {formatBraintreeShippingAddressGoogle, getPhoneNumber} from 'src';
import Address = google.payments.api.Address;
import {mocked} from 'jest-mock';

jest.mock('src/utils/getPhoneNumber');
const getPhoneNumberMock =mocked(getPhoneNumber, true);


describe('testing formatBraintreeShippingAddressGoogle function', () => {

    test('testing formatBraintreeShippingAddressGoogle - IntermediateAddress ',  () => {

        const address: IntermediateAddress = {
            administrativeArea: 'MB',
            countryCode: 'CA',
            postalCode: 'R3M1A1',
            locality: 'winnipeg'
        };
        const expected = {
            address_line_1: '',
            address_line_2: '',
            business_name: '',
            city: 'winnipeg',
            country: 'Canada',
            country_code: 'CA',
            first_name: '',
            last_name: '',
            phone_number: '',
            postal_code: 'R3M1A1',
            province: '',
            province_code: '',
        };
        const result = formatBraintreeShippingAddressGoogle(address);
        expect(result).toStrictEqual(expected);
    });

    test('testing formatBraintreeShippingAddressGoogle - IntermediateAddress with phone number override',  () => {

        getPhoneNumberMock.mockReturnValue('1111111111');
        const address: IntermediateAddress = {
            administrativeArea: 'MB',
            countryCode: 'CA',
            postalCode: 'R3M1A1',
            locality: 'winnipeg'
        };
        const expected = {
            address_line_1: '',
            address_line_2: '',
            business_name: '',
            city: 'winnipeg',
            country: 'Canada',
            country_code: 'CA',
            first_name: '',
            last_name: '',
            phone_number: '1111111111',
            postal_code: 'R3M1A1',
            province: '',
            province_code: '',
        };
        const result = formatBraintreeShippingAddressGoogle(address, true);
        expect(result).toStrictEqual(expected);
    });

    test('testing formatBraintreeShippingAddressGoogle - Address ',  () => {

        const address: Address = {
            name: 'john kris',
            address1: '1234 address',
            address2: 'apt 123',
            locality: 'winnipeg',
            administrativeArea: 'mb',
            countryCode: 'CA',
            postalCode: 'R3M1A1',
            phoneNumber: '123-456-7890'
        };
        const expected = {
            address_line_1: '1234 address',
            address_line_2: 'apt 123',
            business_name: '',
            city: 'winnipeg',
            country: 'Canada',
            country_code: 'CA',
            first_name: 'john',
            last_name: 'kris',
            phone_number: '123-456-7890',
            postal_code: 'R3M1A1',
            province: '',
            province_code: '',
        };
        const result = formatBraintreeShippingAddressGoogle(address);
        expect(result).toStrictEqual(expected);
    });

    test('testing formatBraintreeShippingAddressGoogle - empty data ',  () => {

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const address : Address = {name: '', address1: '', address2: '', locality: undefined, administrativeArea: undefined, postalCode: undefined, phoneNumber: '', countryCode: undefined};
        const expected = {
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
            province_code: '',
        };
        const result = formatBraintreeShippingAddressGoogle(address);
        expect(result).toStrictEqual(expected);
    });

    test('testing formatBraintreeShippingAddressGoogle - undefined address ',  () => {
        const expected = {
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
            province_code: '',
        };
        const result = formatBraintreeShippingAddressGoogle(undefined);
        expect(result).toStrictEqual(expected);
    });

});
