import {mocked} from 'jest-mock';
import {
    alternatePaymentMethodType,
    getOrderInitialData,
    IExpressPayPaypalCommercePlatformButton
} from '@boldcommerce/checkout-frontend-library';
import {orderInitialDataMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {
    displayError,
    enableDisableSection,
    initPpcp,
    initPpcpButtons,
    setOnAction,
    showPaymentMethodTypes
} from 'src';


jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getOrderInitialData');
jest.mock('src/initialize/manageExpressPayContext');
jest.mock('src/actions');
jest.mock('src/paypal/ppcp_buttons');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const setOnActionMock = mocked(setOnAction, true);
const displayErrorMock = mocked(displayError, true);
const enableDisableSectionMock = mocked(enableDisableSection, true);
const initPpcpButtonsMock = mocked(initPpcpButtons, true);

describe('testing initPpcp function', () => {
    const onActionMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
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

        const payments = {...orderInitialDataMock};
        payments.alternative_payment_methods = [paypalPayment];

        getOrderInitialDataMock.mockReturnValueOnce(payments);
        initPpcp(onActionMock);

        expect(setOnActionMock).toHaveBeenCalledTimes(1);
        expect(displayErrorMock).toHaveBeenCalledTimes(0);
        expect(enableDisableSectionMock).toHaveBeenCalledTimes(0);
        expect(initPpcpButtonsMock).toHaveBeenCalledTimes(1);
        expect(initPpcpButtonsMock).toHaveBeenCalledWith(paypalPayment);

    });

});
