import {mocked} from 'jest-mock';
import {baseReturnObject, createPaymentGatewayOrder, ICreatePaymentGatewayOrderResponse} from '@boldcommerce/checkout-frontend-library';
import {applicationStateMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {displayError, ppcpOrderCreate} from 'src';

jest.mock('@boldcommerce/checkout-frontend-library/lib/payment/createPaymentGatewayOrder');
jest.mock('src/actions/displayError');
const initPaymentMock = mocked(createPaymentGatewayOrder, true);
const displayErrorMock = mocked(displayError, true);

describe('testing  ppcpOrderCreate function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('testing with successful call', async () => {
        const response: ICreatePaymentGatewayOrderResponse = {
            data: {
                id: 'test-order'
            },
            application_state: applicationStateMock
        };

        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = true;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        paymentReturn.response = response;
        initPaymentMock.mockReturnValue(Promise.resolve(paymentReturn));

        const result = await ppcpOrderCreate();
        expect(result).toBe('test-order');
    });


    test('testing with unsuccessful call', async () => {
        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = false;
        initPaymentMock.mockReturnValue(Promise.resolve(paymentReturn));

        const result = await ppcpOrderCreate();
        expect(displayErrorMock).toHaveBeenCalledTimes(1);
        expect(displayErrorMock).toHaveBeenCalledWith('There was an unknown error while loading the payment.', 'payment_gateway', 'unknown_error');
        expect(result).toBe('');
    });


});
