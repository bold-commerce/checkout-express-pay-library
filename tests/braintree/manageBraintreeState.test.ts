import {
    BraintreeNullStateKeyError,
    braintreeState,
    getBraintreeAppleCredentials,
    getBraintreeAppleCredentialsChecked,
    getBraintreeApplePayInstance,
    getBraintreeApplePayInstanceChecked, getBraintreeApplePaySession,
    getBraintreeApplePaySessionChecked, getBraintreeClient,
    getBraintreeGoogleCredentials,
    getBraintreeGoogleCredentialsChecked, getBraintreeGooglePayClient,
    getBraintreeGooglePayClientChecked, getBraintreeGooglePayInstance,
    getBraintreeGooglePayInstanceChecked, hasBraintreeClient,
    IBraintreeApplePayInstance, IBraintreeClient, IBraintreeGooglePayInstance,
    setBraintreeAppleCredentials, setBraintreeApplePayInstance, setBraintreeApplePaySession, setBraintreeClient,
    setBraintreeGoogleCredentials, setBraintreeGooglePayClient, setBraintreeGooglePayInstance,
} from 'src';
import {
    alternatePaymentMethodType,
    IExpressPayBraintree,
    IExpressPayBraintreeApple,
    IExpressPayBraintreeGoogle
} from '@bold-commerce/checkout-frontend-library';
import PaymentsClient = google.payments.api.PaymentsClient;

const braintreePayment: IExpressPayBraintree = {
    type: alternatePaymentMethodType.BRAINTREE_GOOGLE,
    public_id: 'somePublicId',
    is_test: true,
    merchant_account: 'someMerchantAccount',
    tokenization_key: 'someTokenizationKey',
    button_style: {}
};
const braintreePaymentGoogle: IExpressPayBraintreeGoogle = {
    ...braintreePayment,
    google_pay_enabled: true,
    google_pay_merchant_identifier: 'someGooglePayMerchantIdentifier',
    apiVersion: 'someApiVersion',
    sdkVersion: 'someSdkVersion',
    merchantId: 'someMerchantId',
};
const braintreePaymentApple: IExpressPayBraintreeApple = {
    ...braintreePayment,
    type: alternatePaymentMethodType.BRAINTREE_APPLE,
    apple_pay_enabled: true
};
const braintreeApplePayInstance: IBraintreeApplePayInstance = {
    createPaymentRequest: jest.fn(),
    performValidation: jest.fn(),
    tokenize: jest.fn(),
};
const applePaySession = {
    begin: jest.fn(),
} as unknown as ApplePaySession;
const googlePayInstance: IBraintreeGooglePayInstance = {
    createPaymentDataRequest: jest.fn(),
    parseResponse: jest.fn(),
};
const googlePayClient: PaymentsClient = {
    createButton: jest.fn(),
    isReadyToPay: jest.fn(),
    loadPaymentData: jest.fn(),
    prefetchPaymentData: jest.fn(),
};
const braintree: IBraintreeClient = {
    applePay: {create: jest.fn()}, client: {create: jest.fn()}, googlePayment: {create: jest.fn()}
};

describe('testing manageBraintreeState functions', () => {
    describe('call all Bool checker', () => {
        const data = [
            {
                name: 'hasBraintreeClient with mock',
                key: 'braintree',
                preSet: null,
                call: hasBraintreeClient,
                expected: false
            },{
                name: 'hasBraintreeClient with null',
                key: 'braintree',
                preSet: braintreePaymentGoogle,
                call: hasBraintreeClient,
                expected: true
            },
        ];
        test.each(data)('$name', async ({key, preSet, call, expected}) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            braintreeState[key] = preSet;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(call()).toBe(expected);
        });
    });

    describe('call all setters', () => {
        const settersData = [
            {
                name: 'setBraintreeGoogleCredentials with mock',
                key: 'googleCredentials',
                preSet: null,
                call: setBraintreeGoogleCredentials,
                param: braintreePaymentGoogle
            },{
                name: 'setBraintreeGoogleCredentials with null',
                key: 'googleCredentials',
                preSet: braintreePaymentGoogle,
                call: setBraintreeGoogleCredentials,
                param: null
            },{
                name: 'setBraintreeAppleCredentials with mock',
                key: 'appleCredentials',
                preSet: null,
                call: setBraintreeAppleCredentials,
                param: braintreePaymentApple
            },{
                name: 'setBraintreeAppleCredentials with null',
                key: 'appleCredentials',
                preSet: braintreePaymentApple,
                call: setBraintreeAppleCredentials,
                param: null
            },{
                name: 'setBraintreeClient with mock',
                key: 'braintree',
                preSet: null,
                call: setBraintreeClient,
                param: braintree
            },{
                name: 'setBraintreeClient with null',
                key: 'braintree',
                preSet: braintree,
                call: setBraintreeClient,
                param: null
            },{
                name: 'setBraintreeApplePayInstance with mock',
                key: 'appleInstance',
                preSet: null,
                call: setBraintreeApplePayInstance,
                param: braintreeApplePayInstance
            },{
                name: 'setBraintreeApplePayInstance with null',
                key: 'appleInstance',
                preSet: braintreeApplePayInstance,
                call: setBraintreeApplePayInstance,
                param: null
            },{
                name: 'setBraintreeApplePaySession with mock',
                key: 'appleSession',
                preSet: null,
                call: setBraintreeApplePaySession,
                param: applePaySession
            },{
                name: 'setBraintreeApplePaySession with null',
                key: 'appleSession',
                preSet: applePaySession,
                call: setBraintreeApplePaySession,
                param: null
            },{
                name: 'setBraintreeGooglePayInstance with mock',
                key: 'googlePayInstance',
                preSet: null,
                call: setBraintreeGooglePayInstance,
                param: googlePayInstance
            },{
                name: 'setBraintreeGooglePayInstance with null',
                key: 'googlePayInstance',
                preSet: googlePayInstance,
                call: setBraintreeGooglePayInstance,
                param: null
            },{
                name: 'setBraintreeGooglePayClient with mock',
                key: 'googlePayClient',
                preSet: null,
                call: setBraintreeGooglePayClient,
                param: googlePayClient
            },{
                name: 'setBraintreeGooglePayClient with null',
                key: 'googlePayClient',
                preSet: googlePayClient,
                call: setBraintreeGooglePayClient,
                param: null
            },
        ];
        test.each(settersData)('$name', async ({key, preSet, call, param}) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            braintreeState[key] = preSet;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            call(param);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(braintreeState[key]).toBe(param);
        });
    });

    describe('call all getters success', () => {
        const gettersData = [
            {
                name: 'getBraintreeGoogleCredentials with null',
                key: 'googleCredentials',
                preSet: null,
                call: getBraintreeGoogleCredentials
            },{
                name: 'getBraintreeGoogleCredentials with mock',
                key: 'googleCredentials',
                preSet: braintreePaymentGoogle,
                call: getBraintreeGoogleCredentials
            },{
                name: 'getBraintreeGoogleCredentialsChecked with mock',
                key: 'googleCredentials',
                preSet: braintreePaymentGoogle,
                call: getBraintreeGoogleCredentialsChecked
            },{
                name: 'getBraintreeAppleCredentials with null',
                key: 'appleCredentials',
                preSet: null,
                call: getBraintreeAppleCredentials
            },{
                name: 'getBraintreeAppleCredentials with mock',
                key: 'appleCredentials',
                preSet: braintreePaymentApple,
                call: getBraintreeAppleCredentials
            },{
                name: 'getBraintreeAppleCredentialsChecked with mock',
                key: 'appleCredentials',
                preSet: braintreePaymentApple,
                call: getBraintreeAppleCredentialsChecked
            },{
                name: 'getBraintreeClient with null',
                key: 'braintree',
                preSet: null,
                call: getBraintreeClient
            },{
                name: 'getBraintreeClient with mock',
                key: 'braintree',
                preSet: braintree,
                call: getBraintreeClient
            },{
                name: 'getBraintreeApplePayInstance with null',
                key: 'appleInstance',
                preSet: null,
                call: getBraintreeApplePayInstance
            },{
                name: 'getBraintreeApplePayInstance with mock',
                key: 'appleInstance',
                preSet: braintreeApplePayInstance,
                call: getBraintreeApplePayInstance
            },{
                name: 'getBraintreeApplePayInstanceChecked with mock',
                key: 'appleInstance',
                preSet: braintreeApplePayInstance,
                call: getBraintreeApplePayInstanceChecked
            },{
                name: 'getBraintreeApplePaySession with null',
                key: 'appleSession',
                preSet: null,
                call: getBraintreeApplePaySession
            },{
                name: 'getBraintreeApplePaySession with mock',
                key: 'appleSession',
                preSet: applePaySession,
                call: getBraintreeApplePaySession
            },{
                name: 'getBraintreeApplePaySessionChecked with mock',
                key: 'appleSession',
                preSet: applePaySession,
                call: getBraintreeApplePaySessionChecked
            },{
                name: 'getBraintreeGooglePayInstance with null',
                key: 'googlePayInstance',
                preSet: null,
                call: getBraintreeGooglePayInstance
            },{
                name: 'getBraintreeGooglePayInstance with mock',
                key: 'googlePayInstance',
                preSet: googlePayInstance,
                call: getBraintreeGooglePayInstance
            },{
                name: 'getBraintreeGooglePayInstanceChecked with mock',
                key: 'googlePayInstance',
                preSet: googlePayInstance,
                call: getBraintreeGooglePayInstanceChecked
            },{
                name: 'getBraintreeGooglePayClient with null',
                key: 'googlePayClient',
                preSet: null,
                call: getBraintreeGooglePayClient
            },{
                name: 'getBraintreeGooglePayClient with mock',
                key: 'googlePayClient',
                preSet: googlePayClient,
                call: getBraintreeGooglePayClient
            },{
                name: 'getBraintreeGooglePayClientChecked with mock',
                key: 'googlePayClient',
                preSet: googlePayClient,
                call: getBraintreeGooglePayClientChecked
            },
        ];
        test.each(gettersData)('$name', async ({key, preSet, call}) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            braintreeState[key] = preSet;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(call()).toBe(preSet);
        });
    });

    describe('call all getters checked failure', () => {
        const gettersCheckedData = [
            {
                name: 'getBraintreeGoogleCredentialsChecked with null',
                key: 'googleCredentials',
                call: getBraintreeGoogleCredentialsChecked
            },{
                name: 'getBraintreeAppleCredentialsChecked with null',
                key: 'appleCredentials',
                call: getBraintreeAppleCredentialsChecked
            },{
                name: 'getBraintreeApplePayInstanceChecked with null',
                key: 'appleInstance',
                call: getBraintreeApplePayInstanceChecked
            },{
                name: 'getBraintreeApplePaySessionChecked with null',
                key: 'appleSession',
                call: getBraintreeApplePaySessionChecked
            },{
                name: 'getBraintreeGooglePayInstanceChecked with null',
                key: 'googlePayInstance',
                call: getBraintreeGooglePayInstanceChecked
            },{
                name: 'getBraintreeGooglePayClientChecked with null',
                key: 'googlePayClient',
                call: getBraintreeGooglePayClientChecked
            },
        ];
        test.each(gettersCheckedData)('$name', async ({key, call}) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            braintreeState[key] = null;
            try {
                call();
                expect('This expect should not run, call should Throw').toBe(null);
            } catch (e) {
                expect(e).toStrictEqual(new BraintreeNullStateKeyError(`Precondition violated: ${key} is null`));
            }
        });
    });
});
