import {alternatePaymentMethodType, IExpressPayPaypalCommercePlatform,} from '@boldcommerce/checkout-frontend-library';
import {
    getPaypalScriptOptions,
    hasPaypalNameSpaceApple,
    initPPCPApple,
    loadJS,
    paypalConstants,
    ppcpOnLoadApple,
    setPaypalNameSpace,
    setPPCPAppleCredentials,
} from 'src';
import {mocked} from 'jest-mock';
import {loadScript, PayPalNamespace, PayPalScriptOptions} from '@paypal/paypal-js';

jest.mock('@paypal/paypal-js');
jest.mock('src/paypal/getPaypalScriptOptions');
jest.mock('src/paypal/managePaypalState');
jest.mock('src/paypal/paypalOnload');
jest.mock('src/paypal/ppcp_apple/ppcpOnLoadApple');
jest.mock('src/utils/loadJS');
const getPaypalScriptOptionsMock = mocked(getPaypalScriptOptions, true);
const hasPaypalNameSpaceAppleMock = mocked(hasPaypalNameSpaceApple, true);
const ppcpOnLoadAppleMock = mocked(ppcpOnLoadApple, true);
const setPPCPAppleCredentialsMock = mocked(setPPCPAppleCredentials, true);
const setPaypalNameSpaceMock = mocked(setPaypalNameSpace, true);
const loadScriptMock = mocked(loadScript, true);
const loadJSMock = mocked(loadJS, true);

const supportsVersionMock = jest.fn();
const canMakePaymentsMock = jest.fn();
const applePaySession = {supportsVersion: supportsVersionMock, canMakePayments: canMakePaymentsMock};

describe('testing initPPCPApple function', () => {
    const ppcpPayment: IExpressPayPaypalCommercePlatform = {
        type: alternatePaymentMethodType.PPCP_APPLE,
        is_test: true,
        public_id: 'somePublicId',
        apple_pay_enabled: true,
        google_pay_enabled: true,
        partner_id: 'somePartnerId',
        merchant_id: 'someMerchantId',
        fastlane_styles: {}
    };
    const paypalNameSpaceMock: PayPalNamespace = {version: 'test_mock_version'};
    const paypalScriptOptions: PayPalScriptOptions = {
        'clientId': ppcpPayment.partner_id,
        'debug': ppcpPayment.is_test,
        'currency': 'USD',
        'disableFunding': 'credit,card,venmo,sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort',
        'vault': 'true',
        'intent': 'authorize',
        'integrationDate': '2020-03-10',
        'merchantId': ppcpPayment.merchant_id,
        'components': 'applepay',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getPaypalScriptOptionsMock.mockReturnValue(paypalScriptOptions);
        hasPaypalNameSpaceAppleMock.mockReturnValue(false);
        loadScriptMock.mockReturnValue(Promise.resolve(paypalNameSpaceMock));
        loadJSMock.mockReturnValue(Promise.resolve());
        loadJSMock.mockImplementation((urlString: string, fn?: () => void) => {
            fn && fn();
            return Promise.resolve();
        });
        supportsVersionMock.mockReturnValue(true);
        canMakePaymentsMock.mockReturnValue(true);
        window.ApplePaySession = applePaySession;
    });

    test('testing call initPPCPApple set PPCP Credentials', async () => {
        await initPPCPApple(ppcpPayment);

        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledWith(ppcpPayment);
        expect(hasPaypalNameSpaceAppleMock).toHaveBeenCalledTimes(1);
        expect(getPaypalScriptOptionsMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledWith(paypalScriptOptions);
        expect(loadJSMock).toHaveBeenCalledTimes(1);
        expect(loadJSMock).toHaveBeenCalledWith(paypalConstants.APPLEPAY_JS);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledWith(paypalNameSpaceMock);
        expect(ppcpOnLoadAppleMock).toHaveBeenCalledTimes(1);
    });

    test('testing call initPPCPApple null paypal name space', async () => {
        loadScriptMock.mockReturnValueOnce(Promise.resolve(null));

        await initPPCPApple(ppcpPayment);

        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledWith(ppcpPayment);
        expect(hasPaypalNameSpaceAppleMock).toHaveBeenCalledTimes(1);
        expect(getPaypalScriptOptionsMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledWith(paypalScriptOptions);
        expect(loadJSMock).toHaveBeenCalledTimes(1);
        expect(loadJSMock).toHaveBeenCalledWith(paypalConstants.APPLEPAY_JS);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledWith(null);
        expect(ppcpOnLoadAppleMock).toHaveBeenCalledTimes(0);
    });

    test('testing call initPPCPApple has paypal name space', async () => {
        hasPaypalNameSpaceAppleMock.mockReturnValueOnce(true);

        await initPPCPApple(ppcpPayment);

        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledWith(ppcpPayment);
        expect(hasPaypalNameSpaceAppleMock).toHaveBeenCalledTimes(1);
        expect(getPaypalScriptOptionsMock).toHaveBeenCalledTimes(0);
        expect(loadScriptMock).toHaveBeenCalledTimes(0);
        expect(loadJSMock).toHaveBeenCalledTimes(1);
        expect(loadJSMock).toHaveBeenCalledWith(paypalConstants.APPLEPAY_JS, ppcpOnLoadApple);
    });


    test('testing call initPPCPApple has apple_pay_enabled false', async () => {
        const ppcpPaymentAppleDisabled: IExpressPayPaypalCommercePlatform = {
            type: alternatePaymentMethodType.PPCP_APPLE,
            is_test: true,
            public_id: 'somePublicId',
            apple_pay_enabled: false,
            google_pay_enabled: false,
            partner_id: 'somePartnerId',
            merchant_id: 'someMerchantId',
            fastlane_styles: {}
        };

        await initPPCPApple(ppcpPaymentAppleDisabled);

        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledWith(ppcpPaymentAppleDisabled);
        expect(hasPaypalNameSpaceAppleMock).toHaveBeenCalledTimes(1);
        expect(getPaypalScriptOptionsMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledTimes(1);
        expect(loadJSMock).toHaveBeenCalledTimes(1);
        expect(loadJSMock).toHaveBeenCalledWith(paypalConstants.APPLEPAY_JS);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledWith(paypalNameSpaceMock);
        expect(ppcpOnLoadAppleMock).toHaveBeenCalledTimes(1);
    });


    test('Its not Apple Session', async () => {
        window.ApplePaySession = undefined;

        await initPPCPApple(ppcpPayment);

        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(getPaypalScriptOptionsMock).toHaveBeenCalledTimes(0);
        expect(loadScriptMock).toHaveBeenCalledTimes(0);
        expect(loadJSMock).toHaveBeenCalledTimes(0);
    });

    test('Apple Session does not supportsVersion', async () => {
        supportsVersionMock.mockReturnValueOnce(false);

        await initPPCPApple(ppcpPayment);

        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(getPaypalScriptOptionsMock).toHaveBeenCalledTimes(0);
        expect(loadScriptMock).toHaveBeenCalledTimes(0);
        expect(loadJSMock).toHaveBeenCalledTimes(0);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledTimes(0);
    });

    test('Apple Session can not Make Payments', async () => {
        canMakePaymentsMock.mockReturnValueOnce(false);

        await initPPCPApple(ppcpPayment);

        expect(setPPCPAppleCredentialsMock).toHaveBeenCalledTimes(1);
        expect(getPaypalScriptOptionsMock).toHaveBeenCalledTimes(0);
        expect(loadScriptMock).toHaveBeenCalledTimes(0);
        expect(loadJSMock).toHaveBeenCalledTimes(0);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledTimes(0);
    });

});
