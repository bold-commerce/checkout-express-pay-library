import {
    alternatePaymentMethodType,
    IExpressPayPaypal,
} from '@bold-commerce/checkout-frontend-library';
import {
    enableDisableSection,
    getPaypalNameSpace,
    paypalCreateOrder,
    paypalOnApprove,
    paypalOnClick,
    paypalOnload,
    paypalOnShippingChange,
} from 'src';
import {mocked} from 'jest-mock';
import {PayPalNamespace} from '@paypal/paypal-js';

jest.mock('src/paypal/managePaypalState');
jest.mock('src/actions/enableDisableSection');
const getPaypalNameSpaceMock = mocked(getPaypalNameSpace, true);
const enableDisableSectionMock = mocked(enableDisableSection, true);

describe('testing paypalOnload function', () => {
    const paypalPayment: IExpressPayPaypal = {
        type: alternatePaymentMethodType.PAYPAL,
        is_test: true,
        client_id: 'someClientId',
        button_style: {},
        public_id: 'somePublicId',
    };
    const paypalButtonsOptions = {
        createOrder: paypalCreateOrder,
        onClick: paypalOnClick,
        onShippingChange: paypalOnShippingChange,
        onApprove: paypalOnApprove,
        style: {
            ...paypalPayment.button_style,
            height: 39
        }
    };
    const paypalButtonsMock = jest.fn();
    const paypalMock = {Buttons: paypalButtonsMock};
    const paypalButtonRenderMock = jest.fn();
    const paypalButtonIsEligibleMock = jest.fn();
    const paypalButtonMock = {render: paypalButtonRenderMock, isEligible: paypalButtonIsEligibleMock};

    beforeEach(() => {
        jest.clearAllMocks();
        getPaypalNameSpaceMock.mockReturnValue(paypalMock as unknown as PayPalNamespace);
        paypalButtonsMock.mockReturnValue(paypalButtonMock);
        paypalButtonIsEligibleMock.mockReturnValue(true);
        document.body.innerHTML = '';
    });

    test('call paypalOnload successful rendering', async () => {
        const containerDiv = document.createElement('div');
        containerDiv.id = 'express-payment-container';
        document.body.appendChild(containerDiv);

        await paypalOnload(paypalPayment);

        expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonsMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonsMock).toHaveBeenCalledWith(paypalButtonsOptions);
        expect(document.getElementById('paypal-express-payment')).not.toBeNull();
        expect(document.getElementById('paypal-express-payment')?.style.display).toBe('');
        expect(paypalButtonIsEligibleMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonRenderMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonRenderMock).toHaveBeenCalledWith('#paypal-express-payment');
        expect(enableDisableSectionMock).toHaveBeenCalledTimes(1);
        expect(enableDisableSectionMock).toHaveBeenCalledWith(alternatePaymentMethodType.PAYPAL, true);
    });

    test('call paypalOnload without paypal namespace', async () => {
        getPaypalNameSpaceMock.mockReturnValue(null);

        await paypalOnload(paypalPayment);

        expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonsMock).toHaveBeenCalledTimes(0);
        expect(document.getElementById('paypal-express-payment')).toBeNull();
        expect(paypalButtonIsEligibleMock).toHaveBeenCalledTimes(0);
        expect(paypalButtonRenderMock).toHaveBeenCalledTimes(0);
        expect(enableDisableSectionMock).toHaveBeenCalledTimes(0);
    });

    test('call paypalOnload with isEligible false', async () => {
        const containerDiv = document.createElement('div');
        containerDiv.id = 'express-payment-container';
        document.body.appendChild(containerDiv);
        paypalButtonIsEligibleMock.mockReturnValueOnce(false);

        await paypalOnload(paypalPayment);

        expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonsMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonsMock).toHaveBeenCalledWith(paypalButtonsOptions);
        expect(document.getElementById('paypal-express-payment')).not.toBeNull();
        expect(document.getElementById('paypal-express-payment')?.style.display).toBe('none');
        expect(paypalButtonIsEligibleMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonRenderMock).toHaveBeenCalledTimes(0);
        expect(enableDisableSectionMock).toHaveBeenCalledTimes(0);
    });

    test('call paypalOnload without container', async () => {

        await paypalOnload(paypalPayment);

        expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonsMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonsMock).toHaveBeenCalledWith(paypalButtonsOptions);
        expect(document.getElementById('paypal-express-payment')).toBeNull();
        expect(paypalButtonIsEligibleMock).toHaveBeenCalledTimes(0);
        expect(paypalButtonRenderMock).toHaveBeenCalledTimes(0);
        expect(enableDisableSectionMock).toHaveBeenCalledTimes(0);
    });
});
