import {mocked} from 'jest-mock';
import {getCountryName, getFirstAndLastName, getProvinceDetails, formatStripeShippingAddress, IStripeAddress} from 'src';
import {IAddress} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/utils');
const getProvinceDetailsMock = mocked(getProvinceDetails, true);
const getCountryNameMock = mocked(getCountryName, true);
const getFirstAndLastNameMock = mocked(getFirstAndLastName, true);

describe('testing format address function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('verify with correct address', () => {
        getProvinceDetailsMock.mockReturnValueOnce({code: 'MB', name: 'Manitoba'});
        getCountryNameMock.mockReturnValueOnce('Canada');
        getFirstAndLastNameMock.mockReturnValueOnce({firstName:'John', lastName: 'Steve'});
        const params: IStripeAddress = {
            city: 'winnipeg',
            country: 'CA',
            organization: 'Bold',
            phone:'111-111-1111',
            postalCode: 'R3M',
            recipient: 'John Steve',
            region: 'MB',
            addressLine: ['50 Fultz', 'blvd']
        };

        const expectedResult: IAddress = {
            'first_name': 'John',
            'last_name': 'Steve',
            'address_line_1': '50 Fultz',
            'address_line_2': 'blvd',
            'country': 'Canada',
            'city': 'winnipeg',
            'province': 'Manitoba' ,
            'country_code': 'CA',
            'province_code': 'MB',
            'postal_code': 'R3M1A1',
            'business_name': 'Bold',
            'phone_number': '111-111-1111'
        };

        const result = formatStripeShippingAddress(params);
        expect(result).toStrictEqual(expectedResult);

    });


    test('verify with incomplete address', () => {
        getProvinceDetailsMock.mockReturnValueOnce({code: '', name: ''});
        getCountryNameMock.mockReturnValueOnce('');
        getFirstAndLastNameMock.mockReturnValueOnce({firstName:'', lastName: ''});
        const params: IStripeAddress = {
            recipient: '',
            addressLine: []
        };

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

        const result = formatStripeShippingAddress(params);
        expect(result).toStrictEqual(expectedResult);

    });


});
