import {API_RETRY, callShippingAddressEndpoint, isAddressValid} from 'src';
import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    getShippingAddress,
    IFetchError,
    IAddress,
    setShippingAddress,
    updateShippingAddress
} from '@boldcommerce/checkout-frontend-library';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShippingAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/address/setShippingAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/address/updateShippingAddress');
jest.mock('src/utils/isAddressValid');
const getShippingAddressMock = mocked(getShippingAddress, true);
const setShippingAddressMock = mocked(setShippingAddress, true);
const updateShippingAddressMock = mocked(updateShippingAddress, true);
const isAddressValidMock = mocked(isAddressValid, true);

const emptyAddress: IAddress = {
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
const filledAddress1: IAddress = {
    address_line_1: 'Test line 1',
    address_line_2: 'Test line 2',
    business_name: '',
    city: 'Test city',
    country: 'Test Country',
    country_code: 'test_country_code',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '0000000000',
    postal_code: 'M1M1M1',
    province: 'Test Province',
    province_code: 'test_province_code'
};
const filledAddress2: IAddress = {
    first_name: 'Jane',
    address_line_1: 'Another Test line 1',
    address_line_2: 'Another Test line 2',
    business_name: '',
    city: 'Another Test city',
    country: 'Another Test Country',
    country_code: 'another_test_country_code',
    last_name: 'Doe',
    phone_number: '1111111111',
    postal_code: 'M2M2M2',
    province: 'Another Test Province',
    province_code: 'another_test_province_code'
};
const nullKeysAddress2: IAddress = {
    address_line_1: '',
    address_line_2: '',
    business_name: '',
    city: '',
    country: '',
    country_code: null,
    first_name: '',
    last_name: '',
    phone_number: '1111111111',
    postal_code: null,
    province: '',
    province_code: null
} as unknown as IAddress;
const invalidAddressError = new Error('Invalid Shipping Address') as IFetchError;
const successReturn = {...baseReturnObject, success: true};

describe('testing callShippingAddressEndpoint function', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        getShippingAddressMock.mockReturnValue(emptyAddress);
        isAddressValidMock.mockReturnValue(Promise.resolve(true));
        setShippingAddressMock.mockReturnValue(Promise.resolve(successReturn));
        updateShippingAddressMock.mockReturnValue(Promise.resolve(successReturn));
    });

    test('validate not provided, all success', async () => {
        const result = await callShippingAddressEndpoint(filledAddress1);

        expect(result).toStrictEqual(successReturn);
        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock)
            .toHaveBeenCalledWith(
                filledAddress1.first_name,
                filledAddress1.last_name,
                filledAddress1.address_line_1,
                filledAddress1.address_line_2,
                filledAddress1.city,
                filledAddress1.postal_code,
                filledAddress1.country_code,
                filledAddress1.province_code,
                filledAddress1.phone_number,
                'shipping');
        expect(setShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(setShippingAddressMock).toHaveBeenCalledWith(filledAddress1, API_RETRY);
        expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('validate not provided phone number, all success', async () => {
        const filledAddress3: IAddress = {
            address_line_1: 'Test line 1',
            address_line_2: 'Test line 2',
            business_name: '',
            city: 'Test city',
            country: 'Test Country',
            country_code: 'test_country_code',
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '',
            postal_code: 'M1M1M1',
            province: 'Test Province',
            province_code: 'test_province_code'
        };
        const result = await callShippingAddressEndpoint(filledAddress3);

        expect(result).toStrictEqual(successReturn);
        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock)
            .toHaveBeenCalledWith(
                filledAddress1.first_name,
                filledAddress1.last_name,
                filledAddress1.address_line_1,
                filledAddress1.address_line_2,
                filledAddress1.city,
                filledAddress1.postal_code,
                filledAddress1.country_code,
                filledAddress1.province_code,
                '',
                'shipping');
        expect(setShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(setShippingAddressMock).toHaveBeenCalledWith(filledAddress3, API_RETRY);
        expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('validate false, all success', async () => {
        const result = await callShippingAddressEndpoint(filledAddress1, false);

        expect(result).toStrictEqual(successReturn);
        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(0);
        expect(setShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(setShippingAddressMock).toHaveBeenCalledWith(filledAddress1, API_RETRY);
        expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('validate true, empty address, all success', async () => {
        const result = await callShippingAddressEndpoint(emptyAddress, true);

        expect(result).toStrictEqual(successReturn);
        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(0);
        expect(setShippingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('filled diff addresses, all success', async () => {
        getShippingAddressMock.mockReturnValueOnce(filledAddress1);

        const result = await callShippingAddressEndpoint(filledAddress2);

        expect(result).toStrictEqual(successReturn);
        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock)
            .toHaveBeenCalledWith(
                filledAddress2.first_name,
                filledAddress2.last_name,
                filledAddress2.address_line_1,
                filledAddress2.address_line_2,
                filledAddress2.city,
                filledAddress2.postal_code,
                filledAddress2.country_code,
                filledAddress2.province_code,
                filledAddress2.phone_number,
                'shipping');
        expect(setShippingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(updateShippingAddressMock).toHaveBeenCalledWith(filledAddress2, API_RETRY);
    });

    test('filled equal addresses, all success', async () => {
        getShippingAddressMock.mockReturnValueOnce(filledAddress1);

        const result = await callShippingAddressEndpoint(filledAddress1);

        expect(result).toStrictEqual(successReturn);
        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(0);
        expect(setShippingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('null keys address, invalid address', async () => {
        isAddressValidMock.mockReturnValueOnce(Promise.resolve(false));
        const expectedReturn = {...baseReturnObject, error: invalidAddressError};

        const result = await callShippingAddressEndpoint(nullKeysAddress2);

        expect(result).toStrictEqual(expectedReturn);
        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledWith('', '', '', '', '', '', '', '', '1111111111', 'shipping');
        expect(setShippingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('filled address, validate false, set fail', async () => {
        setShippingAddressMock.mockReturnValueOnce(Promise.resolve(baseReturnObject));

        const result = await callShippingAddressEndpoint(filledAddress1, false);

        expect(result).toStrictEqual(baseReturnObject);
        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(0);
        expect(setShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(setShippingAddressMock).toHaveBeenCalledWith(filledAddress1, API_RETRY);
        expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('filled diff addresses, validate false, update fail', async () => {
        getShippingAddressMock.mockReturnValueOnce(filledAddress1);
        updateShippingAddressMock.mockReturnValueOnce(Promise.resolve(baseReturnObject));

        const result = await callShippingAddressEndpoint(filledAddress2, false);

        expect(result).toStrictEqual(baseReturnObject);
        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(0);
        expect(setShippingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(updateShippingAddressMock).toHaveBeenCalledWith(filledAddress2, API_RETRY);
    });

});
