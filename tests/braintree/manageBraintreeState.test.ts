import {
    braintreeState,
    getBraintreeAppleCredentials,
    getBraintreeGoogleCredentials,
    setBraintreeAppleCredentials,
    setBraintreeGoogleCredentials,
} from 'src';
import {
    alternatePaymentMethodType,
    IExpressPayBraintree,
    IExpressPayBraintreeApple,
    IExpressPayBraintreeGoogle
} from '@bold-commerce/checkout-frontend-library';

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

describe('testing manageBraintreeState functions', () => {
    describe('braintreeState.googleCredentials sets and gets', () => {

        test('setBraintreeGoogleCredentials with mock', async () => {
            braintreeState.googleCredentials = null;
            setBraintreeGoogleCredentials(braintreePaymentGoogle);
            expect(braintreeState.googleCredentials).toBe(braintreePaymentGoogle);
        });

        test('setBraintreeGoogleCredentials with null', async () => {
            braintreeState.googleCredentials = braintreePaymentGoogle;
            setBraintreeGoogleCredentials(null);
            expect(braintreeState.googleCredentials).toBe(null);
        });

        test('getBraintreeGoogleCredentials with mock', async () => {
            braintreeState.googleCredentials = braintreePaymentGoogle;
            expect(getBraintreeGoogleCredentials()).toBe(braintreePaymentGoogle);
        });

        test('getBraintreeGoogleCredentials with null', async () => {
            braintreeState.googleCredentials = null;
            expect(getBraintreeGoogleCredentials()).toBe(null);
        });

    });

    describe('braintreeState.appleCredentials sets and gets', () => {

        test('setBraintreeAppleCredentials with mock', async () => {
            braintreeState.appleCredentials = null;
            setBraintreeAppleCredentials(braintreePaymentApple);
            expect(braintreeState.appleCredentials).toBe(braintreePaymentApple);
        });

        test('setBraintreeAppleCredentials with null', async () => {
            braintreeState.appleCredentials = braintreePaymentApple;
            setBraintreeAppleCredentials(null);
            expect(braintreeState.appleCredentials).toBe(null);
        });

        test('getBraintreeAppleCredentials with mock', async () => {
            braintreeState.appleCredentials = braintreePaymentApple;
            expect(getBraintreeAppleCredentials()).toBe(braintreePaymentApple);
        });

        test('getBraintreeAppleCredentials with null', async () => {
            braintreeState.appleCredentials = null;
            expect(getBraintreeAppleCredentials()).toBe(null);
        });

    });
});
