import {
    getPaypalGatewayPublicId,
    getPaypalNameSpace,
    getPaypalNameSpacePromise,
    getPPCPAppleCredentialsChecked,
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
    setPaypalNameSpacePromise,
    setPPCPAppleCredentials,
    setPPCPApplePayConfig,
    setPPCPApplePayInstance,
    setPPCPApplePaySession,
} from 'src';
import {PayPalNamespace} from '@paypal/paypal-js';
import {alternatePaymentMethodType, IExpressPayPaypalCommercePlatform} from '@boldcommerce/checkout-frontend-library';

const paypalMock: PayPalNamespace = {version: 'test'};
const ppcpApplePayInstanceMock: IPPCPApplePayInstance = {config: jest.fn(), validateMerchant: jest.fn(), confirmOrder: jest.fn()};
const ppcpAppleConfigMock: IPPCPAppleConfig = {countryCode: 'US', isEligible: true, merchantCapabilities: [], supportedNetworks: []};
const applePaySessionMock = {begin: jest.fn()} as unknown as ApplePaySession;

describe('testing  managePaypalState functions', () => {
    describe('testing  paypalState.paypal sets and gets', () => {

        test('testing call setPaypalNameSpace with mock', () => {
            paypalState.paypal = null;
            setPaypalNameSpace(paypalMock);
            expect(paypalState.paypal).toBe(paypalMock);
        });

        test('testing call setPaypalNameSpace with null', () => {
            paypalState.paypal = paypalMock;
            setPaypalNameSpace(null);
            expect(paypalState.paypal).toBe(null);
        });

        test('testing call setPaypalNameSpacePromise with null', () => {
            paypalState.paypalPromise = Promise.resolve(paypalMock);
            setPaypalNameSpacePromise(null);
            expect(paypalState.paypalPromise).toBe(null);
        });

        test('testing call setPaypalNameSpacePromise with mock', () => {
            const value = Promise.resolve(paypalMock);
            paypalState.paypalPromise = null;
            setPaypalNameSpacePromise(value);
            expect(paypalState.paypalPromise).toBe(value);
        });

        test('testing call getPaypalNameSpace with mock', () => {
            paypalState.paypal = paypalMock;
            expect(getPaypalNameSpace()).toBe(paypalMock);
        });

        test('testing call getPaypalNameSpace with null', () => {
            paypalState.paypal = null;
            expect(getPaypalNameSpace()).toBe(null);
        });

        test('testing call getPaypalNameSpacePromise with mock', () => {
            const value = Promise.resolve(paypalMock);
            paypalState.paypalPromise = value;
            expect(getPaypalNameSpacePromise()).toBe(value);
        });

        test('testing call getPaypalNameSpacePromise with null', () => {
            paypalState.paypalPromise = null;
            expect(getPaypalNameSpacePromise()).toBe(null);
        });

        test('testing call hasPaypalNameSpace true', () => {
            paypalState.paypal = paypalMock;
            expect(hasPaypalNameSpace()).toBe(true);
        });

        test('testing call hasPaypalNameSpace false', () => {
            paypalState.paypal = null;
            expect(hasPaypalNameSpace()).toBe(false);
        });

        test('testing call hasPaypalNameSpaceApple true', () => {
            paypalState.paypal = {...paypalMock, Applepay: jest.fn()};
            expect(hasPaypalNameSpaceApple()).toBe(true);
        });

        test('testing call hasPaypalNameSpaceApple false with null', () => {
            paypalState.paypal = null;
            expect(hasPaypalNameSpaceApple()).toBe(false);
        });

        test('testing call hasPaypalNameSpaceApple false with mock', () => {
            paypalState.paypal = paypalMock;
            expect(hasPaypalNameSpaceApple()).toBe(false);
        });

    });

    describe('testing  paypalState.gatewayPublicId sets and gets', () => {
        const gatewayPublicIdMock = 'abc123';

        test('testing call setPaypalGatewayPublicId with mock', () => {
            paypalState.gatewayPublicId = '';
            setPaypalGatewayPublicId(gatewayPublicIdMock);
            expect(paypalState.gatewayPublicId).toBe(gatewayPublicIdMock);
        });

        test('testing call setPaypalGatewayPublicId with empty', () => {
            paypalState.gatewayPublicId = '';
            setPaypalGatewayPublicId('');
            expect(paypalState.gatewayPublicId).toBe('');
        });

        test('testing call getPaypalGatewayPublicId with mock', () => {
            paypalState.gatewayPublicId = gatewayPublicIdMock;
            expect(getPaypalGatewayPublicId()).toBe(gatewayPublicIdMock);
        });

        test('testing call getPaypalGatewayPublicId with empty', () => {
            paypalState.gatewayPublicId = '';
            expect(getPaypalGatewayPublicId()).toBe('');
        });

    });

    describe('testing  paypalState.ppcpAppleCredentials sets and gets', () => {
        const ppcpCredentialsMock: IExpressPayPaypalCommercePlatform = {
            type: alternatePaymentMethodType.PPCP_APPLE,
            is_test: true,
            public_id: 'somePublicId',
            apple_pay_enabled: true,
            partner_id: 'somePartnerId',
            merchant_id: 'someMerchantId',
            fastlane_styles: {}
        };

        test('testing call setPPCPAppleCredentials with mock', () => {
            paypalState.ppcpAppleCredentials = null;
            expect(paypalState.ppcpAppleCredentials).toBe(null);
            setPPCPAppleCredentials(ppcpCredentialsMock);
            expect(paypalState.ppcpAppleCredentials).toBe(ppcpCredentialsMock);
        });

        test('testing call setPPCPAppleCredentials with null', () => {
            paypalState.ppcpAppleCredentials = null;
            setPPCPAppleCredentials(null);
            expect(paypalState.ppcpAppleCredentials).toBe(null);
        });

        test('testing call getPPCPAppleCredentialsChecked with mock', () => {
            paypalState.ppcpAppleCredentials = ppcpCredentialsMock;
            expect(getPPCPAppleCredentialsChecked()).toBe(ppcpCredentialsMock);
        });

    });

    describe('testing  paypalState.ppcpApplePayInstance sets and gets', () => {

        test('testing call setPPCPApplePayInstance with mock', () => {
            paypalState.ppcpApplePayInstance = null;
            setPPCPApplePayInstance(ppcpApplePayInstanceMock);
            expect(paypalState.ppcpApplePayInstance).toBe(ppcpApplePayInstanceMock);
        });

        test('testing call setPPCPApplePayInstance with null', () => {
            paypalState.ppcpApplePayInstance = ppcpApplePayInstanceMock;
            setPPCPApplePayInstance(null);
            expect(paypalState.ppcpApplePayInstance).toBe(null);
        });

        test('testing call getPPCPApplePayInstance with mock', () => {
            paypalState.ppcpApplePayInstance = ppcpApplePayInstanceMock;
            expect(getPPCPApplePayInstance()).toBe(ppcpApplePayInstanceMock);
        });

        test('testing call getPPCPApplePayInstance with null', () => {
            paypalState.ppcpApplePayInstance = null;
            expect(getPPCPApplePayInstance()).toBe(null);
        });

        test('testing call getPPCPApplePayInstanceChecked with mock', () => {
            paypalState.ppcpApplePayInstance = ppcpApplePayInstanceMock;
            expect(getPPCPApplePayInstanceChecked()).toBe(ppcpApplePayInstanceMock);
        });

    });

    describe('testing  paypalState.ppcpApplePayConfig sets and gets', () => {

        test('testing call setPPCPApplePayConfig with mock', () => {
            paypalState.ppcpApplePayConfig = null;
            setPPCPApplePayConfig(ppcpAppleConfigMock);
            expect(paypalState.ppcpApplePayConfig).toBe(ppcpAppleConfigMock);
        });

        test('testing call setPPCPApplePayConfig with null', () => {
            paypalState.ppcpApplePayConfig = ppcpAppleConfigMock;
            setPPCPApplePayConfig(null);
            expect(paypalState.ppcpApplePayConfig).toBe(null);
        });

        test('testing call getPPCPApplePayInstance with mock', () => {
            paypalState.ppcpApplePayConfig = ppcpAppleConfigMock;
            expect(getPPCPApplePayConfig()).toBe(ppcpAppleConfigMock);
        });

        test('testing call getPPCPApplePayInstance with null', () => {
            paypalState.ppcpApplePayConfig = null;
            expect(getPPCPApplePayConfig()).toBe(null);
        });

        test('testing call getPPCPApplePayConfigChecked with mock', () => {
            paypalState.ppcpApplePayConfig = ppcpAppleConfigMock;
            expect(getPPCPApplePayConfigChecked()).toBe(ppcpAppleConfigMock);
        });

    });

    describe('testing  paypalState.ppcpApplePaySession sets and gets', () => {

        test('testing call setPPCPApplePaySession with mock', () => {
            paypalState.ppcpApplePaySession = null;
            setPPCPApplePaySession(applePaySessionMock as ApplePaySession);
            expect(paypalState.ppcpApplePaySession).toBe(applePaySessionMock);
        });

        test('testing call setPPCPApplePaySession with null', () => {
            paypalState.ppcpApplePaySession = applePaySessionMock;
            setPPCPApplePaySession(null);
            expect(paypalState.ppcpApplePaySession).toBe(null);
        });

        test('testing call getPPCPApplePaySession with mock', () => {
            paypalState.ppcpApplePaySession = applePaySessionMock;
            expect(getPPCPApplePaySession()).toBe(applePaySessionMock);
        });

        test('testing call getPPCPApplePaySession with null', () => {
            paypalState.ppcpApplePaySession = null;
            expect(getPPCPApplePaySession()).toBe(null);
        });

        test('testing call getPPCPApplePaySessionChecked with mock', () => {
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
            },{
                name: 'getPPCPAppleCredentialsChecked with null',
                key: 'ppcpAppleCredentials',
                call: getPPCPAppleCredentialsChecked
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
