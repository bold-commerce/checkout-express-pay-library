import {mocked} from 'jest-mock';
import {getCountryName, getFirstAndLastName, getProvinceDetails, formatStripeBillingAddress, IStripeCard} from 'src';
import {IAddress} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/utils');
const getProvinceDetailsMock = mocked(getProvinceDetails, true);
const getCountryNameMock = mocked(getCountryName, true);
const getFirstAndLastNameMock = mocked(getFirstAndLastName, true);

describe('testing format billing address function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('verify with correct address', () => {
        getProvinceDetailsMock.mockReturnValueOnce({code: 'MB', name: 'Manitoba'});
        getCountryNameMock.mockReturnValueOnce('Canada');
        getFirstAndLastNameMock.mockReturnValueOnce({firstName:'John', lastName: 'Steve'});
        const params: IStripeCard = {
            address_city: 'winnipeg',
            address_country: 'CA',
            address_line1: '50 Fultz',
            address_line1_check: '',
            address_line2: 'blvd',
            address_state: 'Manitoba',
            address_zip: 'R3M',
            address_zip_check: '',
            brand: 'Visa',
            country: 'CA',
            dynamic_last4: '1111',
            exp_month: 8,
            exp_year: 2023,
            funding: '',
            id: 'test-id',
            last4: '1111',
            name: '',
            object: '',
            tokenization_method: '',
            currency: 'CAD',
            cvc_check: '',
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
            'business_name': '',
            'phone_number': '111-111-1111'
        };

        const result = formatStripeBillingAddress(params, 'John Steve', '111-111-1111');
        expect(result).toStrictEqual(expectedResult);

    });


    test('verify with incomplete address', () => {
        getProvinceDetailsMock.mockReturnValueOnce({code: '', name: ''});
        getCountryNameMock.mockReturnValueOnce('');
        getFirstAndLastNameMock.mockReturnValueOnce({firstName:'', lastName: ''});
        const params: IStripeCard = {
            address_city: '',
            address_country: '',
            address_line1: '',
            address_line1_check: '',
            address_line2: '',
            address_state: '',
            address_zip: '',
            address_zip_check: '',
            brand: '',
            country: '',
            dynamic_last4: '',
            exp_month: 8,
            exp_year: 2023,
            funding: '',
            id: '',
            last4: '',
            name: '',
            object: '',
            tokenization_method: '',
            currency: '',
            cvc_check: '',
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

        const result = formatStripeBillingAddress(params);
        expect(result).toStrictEqual(expectedResult);

    });


});
