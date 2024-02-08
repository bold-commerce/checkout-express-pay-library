import {displayError, paypalCreateOrder} from 'src';
import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    IWalletPayCreateOrderResponse,
    walletPayCreateOrder
} from '@boldcommerce/checkout-frontend-library';
import {applicationStateMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/walletPay/walletPayCreateOrder');
jest.mock('src/actions/displayError');
const walletPayCreateOrderMock = mocked(walletPayCreateOrder, true);
const displayErrorMock = mocked(displayError, true);

describe('testing  paypalCreateOrder function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('testing with successful call', async () => {
        const response: IWalletPayCreateOrderResponse = {
            payment_data: {
                id: 'test-order'
            },
            application_state: applicationStateMock
        };

        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = true;
        paymentReturn.response = {data: response};
        walletPayCreateOrderMock.mockReturnValue(Promise.resolve(paymentReturn));

        const result = await paypalCreateOrder();
        expect(result).toBe('test-order');
    });


    test('testing with unsuccessful call', async () => {
        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = false;
        walletPayCreateOrderMock.mockReturnValue(Promise.resolve(paymentReturn));

        const result = await paypalCreateOrder();
        expect(displayErrorMock).toHaveBeenCalledTimes(1);
        expect(displayErrorMock).toHaveBeenCalledWith('There was an unknown error while loading the payment.', 'payment_gateway', 'unknown_error');
        expect(result).toBe('');
    });

});
