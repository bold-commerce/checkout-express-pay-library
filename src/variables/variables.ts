import {
    IActionTypes,
    IBraintreeConstants,
    IBraintreeState,
    IExpressPayContext,
    IPaypalConstants,
    IPaypalState,
    IShowPaymentMethods,
    IShowPaymentMethodTypes,
} from 'src/types/variables';

export const showPaymentMethods: IShowPaymentMethods = {
    stripe: false,
    paypal: false,
    braintreeGoogle: false,
    braintreeApple: false
};

export const showPaymentMethodTypes: IShowPaymentMethodTypes = {
    STRIPE: 'stripe',
    PAYPAL: 'paypal',
    BRAINTREE_GOOGLE: 'braintreeGoogle',
    BRAINTREE_APPLE: 'braintreeApple'
};

export const expressPayContext: IExpressPayContext = {
    onAction: null
};

export const actionTypes: IActionTypes = {
    ENABLE_DISABLE_SECTION: 'ENABLE_DISABLE_SECTION',
    ORDER_COMPLETED: 'ORDER_COMPLETED',
    ORDER_PROCESSING: 'ORDER_PROCESSING',
    DISPLAY_ERROR: 'DISPLAY_ERROR',
};

export const paypalState: IPaypalState = {
    paypal: null,
    gatewayPublicId: '',
    ppcpAppleCredentials: null,
    ppcpApplePayInstance: null,
};

export const paypalConstants: IPaypalConstants = {
    MAX_SHIPPING_OPTIONS_LENGTH: 10,
    MAX_STRING_LENGTH: 127,
    APPLEPAY_VERSION_NUMBER: 3,
    APPLEPAY_JS: 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js',
};

export const braintreeState: IBraintreeState = {
    braintree: null,
    googlePayClient: null,
    googlePayInstance: null,
    appleInstance: null,
    appleSession: null,
    googleCredentials: null,
    appleCredentials: null
};

export const braintreeConstants: IBraintreeConstants = {
    BASE_JS_URL: 'https://js.braintreegateway.com/web',
    GOOGLE_JS_URL: 'https://pay.google.com/gp/p/js/pay.js',
    CLIENT_JS: 'js/client.min.js',
    APPLE_JS: 'js/apple-pay.min.js',
    GOOGLE_JS: 'js/google-payment.min.js',
    DATA_COLLECTOR_JS: 'js/data-collector.min.js',
    JS_VERSION: '3.88.2',
    APPLEPAY_VERSION_NUMBER: 3,
    APPLEPAY_ERROR_CODE_SHIPPING_CONTACT: 'shippingContactInvalid',
    APPLEPAY_ERROR_CODE_BILLING_CONTACT: 'billingContactInvalid',
    APPLEPAY_ERROR_CODE_UNKNOWN: 'unknown',
    GOOGLEPAY_ERROR_REASON_SHIPPING: 'SHIPPING_ADDRESS_INVALID',
    GOOGLEPAY_ERROR_REASON_PAYMENT: 'PAYMENT_DATA_INVALID',
    GOOGLEPAY_TRANSACTION_STATE_SUCCESS: 'SUCCESS',
    GOOGLEPAY_TRANSACTION_STATE_ERROR: 'ERROR',
    GOOGLEPAY_INTENT_SHIPPING_ADDRESS: 'SHIPPING_ADDRESS',
    GOOGLEPAY_INTENT_SHIPPING_OPTION: 'SHIPPING_OPTION',
    GOOGLEPAY_INTENT_PAYMENT_AUTHORIZATION: 'PAYMENT_AUTHORIZATION',
    GOOGLEPAY_TRIGGER_INITIALIZE: 'INITIALIZE',
    GOOGLEPAY_VERSION_NUMBER: 2,
    GOOGLEPAY_VERSION_NUMBER_MINOR: 0,
};
