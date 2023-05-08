import {API_RETRY, callBillingAddressEndpoint, isAddressValid} from 'src';
import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    getBillingAddress,
    IFetchError,
    IAddress,
    setBillingAddress,
    updateBillingAddress
} from '@boldcommerce/checkout-frontend-library';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getBillingAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/address/setBillingAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/address/updateBillingAddress');
jest.mock('src/utils/isAddressValid');
const getBillingAddressMock = mocked(getBillingAddress, true);
const setBillingAddressMock = mocked(setBillingAddress, true);
const updateBillingAddressMock = mocked(updateBillingAddress, true);
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
    address_line_1: 'Another Test line 1',
    address_line_2: 'Another Test line 2',
    business_name: '',
    city: 'Another Test city',
    country: 'Another Test Country',
    country_code: 'another_test_country_code',
    first_name: 'Jane',
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
const invalidAddressError = new Error('Invalid Billing Address') as IFetchError;
const successReturn = {...baseReturnObject, success: true};

describe('testing callBillingAddressEndpoint function', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        getBillingAddressMock.mockReturnValue(emptyAddress);
        isAddressValidMock.mockReturnValue(Promise.resolve(true));
        setBillingAddressMock.mockReturnValue(Promise.resolve(successReturn));
        updateBillingAddressMock.mockReturnValue(Promise.resolve(successReturn));
    });

    test('validate not provided, all success', async () => {
        const result = await callBillingAddressEndpoint(filledAddress1);

        expect(result).toStrictEqual(successReturn);
        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
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
                'billing');
        expect(setBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(setBillingAddressMock).toHaveBeenCalledWith(filledAddress1, API_RETRY);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('validate false, all success', async () => {
        const result = await callBillingAddressEndpoint(filledAddress1, false);

        expect(result).toStrictEqual(successReturn);
        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(0);
        expect(setBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(setBillingAddressMock).toHaveBeenCalledWith(filledAddress1, API_RETRY);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('validate true, empty address, all success', async () => {
        const result = await callBillingAddressEndpoint(emptyAddress, true);

        expect(result).toStrictEqual(successReturn);
        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(0);
        expect(setBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('filled diff addresses, all success', async () => {
        getBillingAddressMock.mockReturnValueOnce(filledAddress1);

        const result = await callBillingAddressEndpoint(filledAddress2);

        expect(result).toStrictEqual(successReturn);
        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
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
                'billing');
        expect(setBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(updateBillingAddressMock).toHaveBeenCalledWith(filledAddress2, API_RETRY);
    });

    test('filled equal addresses, all success', async () => {
        getBillingAddressMock.mockReturnValueOnce(filledAddress1);

        const result = await callBillingAddressEndpoint(filledAddress1);

        expect(result).toStrictEqual(successReturn);
        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(0);
        expect(setBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('null keys address, invalid address', async () => {
        isAddressValidMock.mockReturnValueOnce(Promise.resolve(false));
        const expectedReturn = {...baseReturnObject, error: invalidAddressError};

        const result = await callBillingAddressEndpoint(nullKeysAddress2);

        expect(result).toStrictEqual(expectedReturn);
        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledWith('', '', '', '', '', '', '', '', 'billing');
        expect(setBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('filled address, validate false, set fail', async () => {
        setBillingAddressMock.mockReturnValueOnce(Promise.resolve(baseReturnObject));

        const result = await callBillingAddressEndpoint(filledAddress1, false);

        expect(result).toStrictEqual(baseReturnObject);
        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(0);
        expect(setBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(setBillingAddressMock).toHaveBeenCalledWith(filledAddress1, API_RETRY);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
    });

    test('filled diff addresses, validate false, update fail', async () => {
        getBillingAddressMock.mockReturnValueOnce(filledAddress1);
        updateBillingAddressMock.mockReturnValueOnce(Promise.resolve(baseReturnObject));

        const result = await callBillingAddressEndpoint(filledAddress2, false);

        expect(result).toStrictEqual(baseReturnObject);
        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(isAddressValidMock).toHaveBeenCalledTimes(0);
        expect(setBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(updateBillingAddressMock).toHaveBeenCalledWith(filledAddress2, API_RETRY);
    });

});
