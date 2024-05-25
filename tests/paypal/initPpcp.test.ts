import {mocked} from 'jest-mock';
import {
    alternatePaymentMethodType,
    getOrderInitialData, IExpressPayPaypalCommercePlatform,
    IExpressPayPaypalCommercePlatformButton
} from '@boldcommerce/checkout-frontend-library';
import {orderInitialDataMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {
    displayError,
    enableDisableSection,
    initPpcp, initPPCPApple,
    initPpcpButtons,
    setOnAction,
    showPaymentMethodTypes
} from 'src';


jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getOrderInitialData');
jest.mock('src/initialize/manageExpressPayContext');
jest.mock('src/actions');
jest.mock('src/paypal/ppcp_buttons');
jest.mock('src/paypal/ppcp_apple/initPPCPApple');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const setOnActionMock = mocked(setOnAction, true);
const displayErrorMock = mocked(displayError, true);
const enableDisableSectionMock = mocked(enableDisableSection, true);
const initPpcpButtonsMock = mocked(initPpcpButtons, true);
const initPPCPAppleMock = mocked(initPPCPApple, true);

describe('testing initPpcp function', () => {
    const onActionMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        initPpcpButtonsMock.mockReturnValue(Promise.resolve());
        initPPCPAppleMock.mockReturnValue(Promise.resolve());
    });

    test('initPpcp successfully without actions', async () => {
        const payments = {...orderInitialDataMock};
        payments.alternative_payment_methods = [];

        getOrderInitialDataMock.mockReturnValueOnce(payments);
        initPpcp();

        expect(setOnActionMock).toHaveBeenCalledTimes(0);
        expect(displayErrorMock).toHaveBeenCalledTimes(1);
        expect(enableDisableSectionMock).toHaveBeenCalledTimes(1);
        expect(enableDisableSectionMock).toHaveBeenCalledWith(showPaymentMethodTypes.PPCP, true);
        expect(displayErrorMock).toHaveBeenCalledWith('There was an unknown error while loading the paypal buttons. Please try again.', 'generic', 'unknown_error');

    });

    test('initPpcp successfully with actions', async () => {
        const paypalPayment: IExpressPayPaypalCommercePlatformButton = {
            type: alternatePaymentMethodType.PPCP,
            is_dev: true,
            merchant_id: 'someClientId',
            partner_id: 'somePartnerId',
            style: {shape: 'rect', color: 'blue'},
            merchant_country: 'US',
            payment_types: {
                paypal: true,
                paylater: true,
                venmo: false,
                paylaterMessages: true
            },
            is_3ds_enabled: false,
            apple_pay_enabled: false,
            public_id: 'somePublicId',
        };

        const applePay: IExpressPayPaypalCommercePlatform = {
            type:  alternatePaymentMethodType.PPCP_APPLE,
            is_test: true,
            public_id: 'somePublicId',
            apple_pay_enabled: true,
            merchant_id: 'someClientId',
            partner_id: 'somePartnerId',
        };

        const payments = {...orderInitialDataMock};
        payments.alternative_payment_methods = [paypalPayment, applePay];

        getOrderInitialDataMock.mockReturnValueOnce(payments);
        await initPpcp(onActionMock);

        expect(setOnActionMock).toHaveBeenCalledTimes(1);
        expect(displayErrorMock).toHaveBeenCalledTimes(0);
        expect(enableDisableSectionMock).toHaveBeenCalledTimes(0);
        expect(initPpcpButtonsMock).toHaveBeenCalledTimes(1);
        expect(initPpcpButtonsMock).toHaveBeenCalledWith(paypalPayment, false);
        expect(initPPCPAppleMock).toHaveBeenCalledTimes(1);
        expect(initPPCPAppleMock).toHaveBeenCalledWith(applePay);

    });

});
