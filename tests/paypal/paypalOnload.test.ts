import {
    getCurrency,
    alternatePaymentMethodType,
    IExpressPayPaypal,
} from '@bold-commerce/checkout-frontend-library';
import {paypalOnload} from 'src';
import {mocked} from 'jest-mock';
import {currencyMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
const getCurrencyMock = mocked(getCurrency, true);

describe('testing paypalOnload function', () => {
    const showHideMock = jest.fn();
    const paypalPayment: IExpressPayPaypal = {
        type: alternatePaymentMethodType.PAYPAL,
        is_test: true,
        client_id: 'someClientId',
        button_style: {},
        public_id: 'somePublicId',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
    });

    // TODO Add tests for CE-500 Add Paypal Express initial order data implementation
    test('call paypalOnload', () => {
        paypalOnload(paypalPayment, showHideMock);

        expect(showHideMock).not.toHaveBeenCalled();
    });
});
