import {getPhoneNumber} from 'src';
import {getOrderInitialData} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {orderInitialDataMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getOrderInitialData');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);

describe('testing getPhoneNumber function', () => {
    const phoneNumberRequired = {...orderInitialDataMock};
    phoneNumberRequired.general_settings.checkout_process.phone_number_required = true;

    const dataSet = [
        {input: undefined, phoneNumberRequired: false,  expected: ''},
        {input: '', phoneNumberRequired: false, expected: ''},
        {input: '1234567891', phoneNumberRequired: false, expected: '1234567891'},
        {input: undefined, phoneNumberRequired: true,  expected: '1111111111'},
        {input: '', phoneNumberRequired: true, expected: '1111111111'},
        {input: '1234567891', phoneNumberRequired: true, expected: '1234567891'},
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    test.each(dataSet)('call getPhoneNumber $input - $phoneNumberRequired - $expected',
        ({input, phoneNumberRequired, expected}) => {
            const orderData = {...orderInitialDataMock};
            orderData.general_settings.checkout_process.phone_number_required = phoneNumberRequired;
            getOrderInitialDataMock.mockReturnValueOnce(orderData);
            const result = getPhoneNumber(input);

            expect(result).toBe(expected);
        });
});
