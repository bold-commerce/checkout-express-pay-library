import {
    alternatePaymentMethodType,
    IExpressPayPaypalCommercePlatformButton
} from '@boldcommerce/checkout-frontend-library';
import {
    ppcpOrderCreate,
    paypalOnClick,
    ppcpOnApprove,
    getPaypalNameSpace,
    enableDisableSection,
    ppcpOnLoad, showPaymentMethodTypes,
} from 'src';
import {PayPalNamespace} from '@paypal/paypal-js';
import {mocked} from 'jest-mock';
import {ppcpOnShippingChange} from 'src/paypal/ppcp_buttons/ppcpOnShippingChange';

jest.mock('src/paypal/managePaypalState');
jest.mock('src/actions/enableDisableSection');
const getPaypalNameSpaceMock = mocked(getPaypalNameSpace, true);
const enableDisableSectionMock = mocked(enableDisableSection, true);

describe('testing ppcpOnload function', () => {

    const paypalPayment: IExpressPayPaypalCommercePlatformButton = {
        type: alternatePaymentMethodType.PAYPAL,
        is_dev: true,
        merchant_id: 'someClientId',
        partner_id: 'somePartnerId',
        style: {shape: 'rect', color: 'blue'},
        merchant_country: 'US',
        payment_types: {
            paypal: true,
            paylater: true,
            venmo: false,
            paylaterMessages: false
        },
        is_3ds_enabled: false,
        apple_pay_enabled: false,
        google_pay_enabled: false,
        public_id: 'somePublicId',
    };


    const paypalButtonsOptions = {
        fundingSource: 'paypal',
        createOrder: ppcpOrderCreate,
        onClick: paypalOnClick,
        onShippingChange: ppcpOnShippingChange,
        onApprove: ppcpOnApprove,
        style: {
            ...paypalPayment.style,
        }
    };

    const payLaterButtonsOptions = {
        fundingSource: 'paylater',
        createOrder: ppcpOrderCreate,
        onClick: paypalOnClick,
        onShippingChange: ppcpOnShippingChange,
        onApprove: ppcpOnApprove,
        style: {
            ...paypalPayment.style,
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

    test('call ppcpOnload successful rendering', async () => {
        const containerDiv = document.createElement('div');
        containerDiv.id = 'express-payment-container';
        document.body.appendChild(containerDiv);

        await ppcpOnLoad(paypalPayment);

        expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonsMock).toHaveBeenCalledTimes(2);
        expect(paypalButtonsMock).toHaveBeenCalledWith(paypalButtonsOptions);
        expect(paypalButtonsMock).toHaveBeenCalledWith(payLaterButtonsOptions);
        expect(document.getElementById('ppcp-express-payment')).not.toBeNull();
        expect(document.getElementById('ppcp-express-payment')?.style.display).toBe('');
        expect(paypalButtonIsEligibleMock).toHaveBeenCalledTimes(2);
        expect(paypalButtonRenderMock).toHaveBeenCalledTimes(2);
        expect(paypalButtonRenderMock).toHaveBeenCalledWith('#ppcp-paypal-express-payment-button');
        expect(paypalButtonRenderMock).toHaveBeenCalledWith('#ppcp-paylater-express-payment-button');
        expect(enableDisableSectionMock).toHaveBeenCalledTimes(1);
        expect(enableDisableSectionMock).toHaveBeenCalledWith(showPaymentMethodTypes.PPCP, true);
    });

    test('call ppcpOnload without paypal namespace', async () => {
        getPaypalNameSpaceMock.mockReturnValue(null);

        await ppcpOnLoad(paypalPayment);

        expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonsMock).toHaveBeenCalledTimes(0);
        expect(document.getElementById('paypal-express-payment')).toBeNull();
        expect(paypalButtonIsEligibleMock).toHaveBeenCalledTimes(0);
        expect(paypalButtonRenderMock).toHaveBeenCalledTimes(0);
        expect(enableDisableSectionMock).toHaveBeenCalledTimes(0);
    });


    test('call ppcpOnload without container', async () => {

        await ppcpOnLoad(paypalPayment);

        expect(getPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(paypalButtonsMock).toHaveBeenCalledTimes(2);
        expect(paypalButtonsMock).toHaveBeenCalledWith(paypalButtonsOptions);
        expect(document.getElementById('paypal-express-payment')).toBeNull();
        expect(paypalButtonIsEligibleMock).toHaveBeenCalledTimes(0);
        expect(paypalButtonRenderMock).toHaveBeenCalledTimes(0);
        expect(enableDisableSectionMock).toHaveBeenCalledTimes(0);
    });
});
