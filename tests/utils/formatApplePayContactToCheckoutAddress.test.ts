import {mocked} from 'jest-mock';
import {getCountryName, getProvinceDetails, formatApplePayContactToCheckoutAddress} from 'src';
import {IAddress} from '@bold-commerce/checkout-frontend-library';
import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;

jest.mock('src/utils/getProvinceDetails');
jest.mock('src/utils/getCountryName');
const getProvinceDetailsMock = mocked(getProvinceDetails, true);
const getCountryNameMock = mocked(getCountryName, true);

describe('testing formatApplePayContactToCheckoutAddress function', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('verify with correct address', () => {
        getProvinceDetailsMock.mockReturnValueOnce({code: 'MB', name: 'Manitoba'});
        getCountryNameMock.mockReturnValueOnce('Canada');
        const appleAddressMock: ApplePayPaymentContact = {
            givenName: 'John',
            familyName: 'Steve',
            phoneNumber: '111-111-1111',
            postalCode: 'R3M1A1',
            locality: 'Winnipeg',
            addressLines: ['50 Fultz', 'blvd'],
            countryCode: 'CA',
            administrativeArea: 'Manitoba'
        };

        const expectedResult: IAddress = {
            'first_name': 'John',
            'last_name': 'Steve',
            'address_line_1': '50 Fultz',
            'address_line_2': 'blvd',
            'country': 'Canada',
            'city': 'Winnipeg',
            'province': 'Manitoba' ,
            'country_code': 'CA',
            'province_code': 'MB',
            'postal_code': 'R3M1A1',
            'business_name': '',
            'phone_number': '111-111-1111'
        };

        const result = formatApplePayContactToCheckoutAddress(appleAddressMock);

        expect(result).toStrictEqual(expectedResult);
    });

    test('verify with empty address', () => {
        getProvinceDetailsMock.mockReturnValueOnce({code: '', name: ''});
        getCountryNameMock.mockReturnValueOnce('');
        const appleAddressMock: ApplePayPaymentContact = {};

        const expectedResult: IAddress = {
            'first_name': '',
            'last_name': '',
            'address_line_1': '',
            'address_line_2': '',
            'country': '',
            'city': '',
            'province': '' ,
            'country_code': '',
            'province_code': '',
            'postal_code': '',
            'business_name': '',
            'phone_number': ''
        };

        const result = formatApplePayContactToCheckoutAddress(appleAddressMock);

        expect(result).toStrictEqual(expectedResult);
    });

});
