import {
    getPaypalGatewayPublicId,
    getPaypalNameSpace,
    hasPaypalNameSpace,
    paypalState,
    setPaypalGatewayPublicId,
    setPaypalNameSpace,
    setPPCPAppleCredentials,
} from 'src';
import {PayPalNamespace} from '@paypal/paypal-js';
import {alternatePaymentMethodType, IExpressPayPaypalCommercePlatform} from '@bold-commerce/checkout-frontend-library';

const paypalMock: PayPalNamespace = {version: 'test'};

describe('testing  managePaypalState functions', () => {
    describe('testing  paypalState.paypal sets and gets', () => {

        test('testing call setPaypalNameSpace with mock', async () => {
            paypalState.paypal = null;
            setPaypalNameSpace(paypalMock);
            expect(paypalState.paypal).toBe(paypalMock);
        });

        test('testing call setPaypalNameSpace with null', async () => {
            paypalState.paypal = paypalMock;
            setPaypalNameSpace(null);
            expect(paypalState.paypal).toBe(null);
        });

        test('testing call getPaypalNameSpace with mock', async () => {
            paypalState.paypal = paypalMock;
            expect(getPaypalNameSpace()).toBe(paypalMock);
        });

        test('testing call getPaypalNameSpace with null', async () => {
            paypalState.paypal = null;
            expect(getPaypalNameSpace()).toBe(null);
        });

        test('testing call hasPaypalNameSpace true', async () => {
            paypalState.paypal = paypalMock;
            expect(hasPaypalNameSpace()).toBe(true);
        });

        test('testing call hasPaypalNameSpace false', async () => {
            paypalState.paypal = null;
            expect(hasPaypalNameSpace()).toBe(false);
        });

    });

    describe('testing  paypalState.gatewayPublicId sets and gets', () => {
        const gatewayPublicIdMock = 'abc123';

        test('testing call setPaypalGatewayPublicId with mock', async () => {
            paypalState.gatewayPublicId = '';
            setPaypalGatewayPublicId(gatewayPublicIdMock);
            expect(paypalState.gatewayPublicId).toBe(gatewayPublicIdMock);
        });

        test('testing call setPaypalGatewayPublicId with empty', async () => {
            paypalState.gatewayPublicId = '';
            setPaypalGatewayPublicId('');
            expect(paypalState.gatewayPublicId).toBe('');
        });

        test('testing call getPaypalGatewayPublicId with mock', async () => {
            paypalState.gatewayPublicId = gatewayPublicIdMock;
            expect(getPaypalGatewayPublicId()).toBe(gatewayPublicIdMock);
        });

        test('testing call getPaypalGatewayPublicId with empty', async () => {
            paypalState.gatewayPublicId = '';
            expect(getPaypalGatewayPublicId()).toBe('');
        });

    });


    describe('testing  paypalState.ppcpAppleCredentials sets', () => {
        const ppcpCredentialsMock: IExpressPayPaypalCommercePlatform = {
            type: alternatePaymentMethodType.PPCP_APPLE,
            is_test: true,
            public_id: 'somePublicId',
            apple_pay_enabled: true,
            partner_id: 'somePartnerId',
            merchant_id: 'someMerchantId',
        };

        test('testing call setPaypalGatewayPublicId with mock', async () => {
            paypalState.ppcpAppleCredentials = null;
            expect(paypalState.ppcpAppleCredentials).toBe(null);
            setPPCPAppleCredentials(ppcpCredentialsMock);
            expect(paypalState.ppcpAppleCredentials).toBe(ppcpCredentialsMock);
        });

        test('testing call setPaypalGatewayPublicId with null', async () => {
            paypalState.ppcpAppleCredentials = null;
            setPPCPAppleCredentials(null);
            expect(paypalState.ppcpAppleCredentials).toBe(null);
        });

    });
});
