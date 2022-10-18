import {
    IActionTypes,
    IExpressPayContext,
    IShowPaymentMethods,
    IPaypalState,
    IBraintreeState,
    IBraintreeConstants,
    IPaypalConstants
} from 'src/types/variables';

export const showPaymentMethods: IShowPaymentMethods = {
    stripe: false,
    paypal: false
};

export const expressPayContext: IExpressPayContext = {
    onAction: null
};

export const actionTypes: IActionTypes = {
    ENABLE_DISABLE_SECTION: 'ENABLE_DISABLE_SECTION',
    ORDER_COMPLETED: 'ORDER_COMPLETED',
    ORDER_PROCESSING: 'ORDER_PROCESSING',
};

export const paypalState: IPaypalState = {
    paypal: null,
    gatewayPublicId: ''
};

export const paypalConstants: IPaypalConstants = {
    MAX_SHIPPING_OPTIONS_LENGTH: 10,
    MAX_STRING_LENGTH: 127,
};

export const braintreeState: IBraintreeState = {
    braintree: null,
    google: null,
    apple: null,
    googleCredentials: null,
    appleCredentials: null
};

export const braintreeConstants: IBraintreeConstants = {
    BASE_JS_URL: 'https://js.braintreegateway.com/web',
    GOOGLE_JS_URL: 'https://pay.google.com/gp/p/js/pay.js',
    CLIENT_JS: 'js/client.min.js',
    APPLE_JS: 'js/apple-pay.min.js',
    DATA_COLLECTOR_JS: 'js/data-collector.min.js',
    JS_VERSION: '3.77.0'
};
