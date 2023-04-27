import {
    getPaypalGatewayPublicId,
    getPaypalNameSpace,
    getPPCPApplePayConfig,
    getPPCPApplePayConfigChecked,
    getPPCPApplePayInstance,
    getPPCPApplePayInstanceChecked,
    getPPCPApplePaySession,
    getPPCPApplePaySessionChecked,
    hasPaypalNameSpace,
    hasPaypalNameSpaceApple,
    IPPCPAppleConfig,
    IPPCPApplePayInstance,
    PaypalNullStateKeyError,
    paypalState,
    setPaypalGatewayPublicId,
    setPaypalNameSpace,
    setPPCPAppleCredentials,
    setPPCPApplePayConfig,
    setPPCPApplePayInstance,
    setPPCPApplePaySession,
} from 'src';
import {PayPalNamespace} from '@paypal/paypal-js';
import {alternatePaymentMethodType, IExpressPayPaypalCommercePlatform} from '@bold-commerce/checkout-frontend-library';

const paypalMock: PayPalNamespace = {version: 'test'};
const ppcpApplePayInstanceMock: IPPCPApplePayInstance = {config: jest.fn(), validateMerchant: jest.fn(), confirmOrder: jest.fn()};
const ppcpAppleConfigMock: IPPCPAppleConfig = {countryCode: 'US', isEligible: true, merchantCapabilities: [], supportedNetworks: []};
const applePaySessionMock = {begin: jest.fn()} as unknown as ApplePaySession;

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

        test('testing call hasPaypalNameSpaceApple true', async () => {
            paypalState.paypal = {...paypalMock, Applepay: jest.fn()};
            expect(hasPaypalNameSpaceApple()).toBe(true);
        });

        test('testing call hasPaypalNameSpaceApple false with null', async () => {
            paypalState.paypal = null;
            expect(hasPaypalNameSpaceApple()).toBe(false);
        });

        test('testing call hasPaypalNameSpaceApple false with mock', async () => {
            paypalState.paypal = paypalMock;
            expect(hasPaypalNameSpaceApple()).toBe(false);
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

    describe('testing  paypalState.ppcpApplePayInstance sets and gets', () => {

        test('testing call setPPCPApplePayInstance with mock', async () => {
            paypalState.ppcpApplePayInstance = null;
            setPPCPApplePayInstance(ppcpApplePayInstanceMock);
            expect(paypalState.ppcpApplePayInstance).toBe(ppcpApplePayInstanceMock);
        });

        test('testing call setPPCPApplePayInstance with null', async () => {
            paypalState.ppcpApplePayInstance = ppcpApplePayInstanceMock;
            setPPCPApplePayInstance(null);
            expect(paypalState.ppcpApplePayInstance).toBe(null);
        });

        test('testing call getPPCPApplePayInstance with mock', async () => {
            paypalState.ppcpApplePayInstance = ppcpApplePayInstanceMock;
            expect(getPPCPApplePayInstance()).toBe(ppcpApplePayInstanceMock);
        });

        test('testing call getPPCPApplePayInstance with null', async () => {
            paypalState.ppcpApplePayInstance = null;
            expect(getPPCPApplePayInstance()).toBe(null);
        });

        test('testing call getPPCPApplePayInstanceChecked with mock', async () => {
            paypalState.ppcpApplePayInstance = ppcpApplePayInstanceMock;
            expect(getPPCPApplePayInstanceChecked()).toBe(ppcpApplePayInstanceMock);
        });

    });

    describe('testing  paypalState.ppcpApplePayConfig sets and gets', () => {

        test('testing call setPPCPApplePayConfig with mock', async () => {
            paypalState.ppcpApplePayConfig = null;
            setPPCPApplePayConfig(ppcpAppleConfigMock);
            expect(paypalState.ppcpApplePayConfig).toBe(ppcpAppleConfigMock);
        });

        test('testing call setPPCPApplePayConfig with null', async () => {
            paypalState.ppcpApplePayConfig = ppcpAppleConfigMock;
            setPPCPApplePayConfig(null);
            expect(paypalState.ppcpApplePayConfig).toBe(null);
        });

        test('testing call getPPCPApplePayInstance with mock', async () => {
            paypalState.ppcpApplePayConfig = ppcpAppleConfigMock;
            expect(getPPCPApplePayConfig()).toBe(ppcpAppleConfigMock);
        });

        test('testing call getPPCPApplePayInstance with null', async () => {
            paypalState.ppcpApplePayConfig = null;
            expect(getPPCPApplePayConfig()).toBe(null);
        });

        test('testing call getPPCPApplePayConfigChecked with mock', async () => {
            paypalState.ppcpApplePayConfig = ppcpAppleConfigMock;
            expect(getPPCPApplePayConfigChecked()).toBe(ppcpAppleConfigMock);
        });

    });

    describe('testing  paypalState.ppcpApplePaySession sets and gets', () => {

        test('testing call setPPCPApplePaySession with mock', async () => {
            paypalState.ppcpApplePaySession = null;
            setPPCPApplePaySession(applePaySessionMock as ApplePaySession);
            expect(paypalState.ppcpApplePaySession).toBe(applePaySessionMock);
        });

        test('testing call setPPCPApplePaySession with null', async () => {
            paypalState.ppcpApplePaySession = applePaySessionMock;
            setPPCPApplePaySession(null);
            expect(paypalState.ppcpApplePaySession).toBe(null);
        });

        test('testing call getPPCPApplePaySession with mock', async () => {
            paypalState.ppcpApplePaySession = applePaySessionMock;
            expect(getPPCPApplePaySession()).toBe(applePaySessionMock);
        });

        test('testing call getPPCPApplePaySession with null', async () => {
            paypalState.ppcpApplePaySession = null;
            expect(getPPCPApplePaySession()).toBe(null);
        });

        test('testing call getPPCPApplePaySessionChecked with mock', async () => {
            paypalState.ppcpApplePaySession = applePaySessionMock;
            expect(getPPCPApplePaySessionChecked()).toBe(applePaySessionMock);
        });

    });

    describe('call all getters checked failure', () => {
        const gettersCheckedData = [
            {
                name: 'getPPCPApplePayInstanceChecked with null',
                key: 'ppcpApplePayInstance',
                call: getPPCPApplePayInstanceChecked
            },{
                name: 'getPPCPApplePaySessionChecked with null',
                key: 'ppcpApplePaySession',
                call: getPPCPApplePaySessionChecked
            },{
                name: 'getPPCPApplePayConfigChecked with null',
                key: 'ppcpApplePayConfig',
                call: getPPCPApplePayConfigChecked
            },
        ];
        test.each(gettersCheckedData)('$name', async ({key, call}) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            paypalState[key] = null;
            try {
                call();
                expect('This expect should not run, call should Throw').toBe(null);
            } catch (e) {
                expect(e).toStrictEqual(new PaypalNullStateKeyError(`Precondition violated: ${key} is null`));
            }
        });
    });
});
