import ApplePayPaymentRequest = ApplePayJS.ApplePayPaymentRequest;
import ApplePayPaymentToken = ApplePayJS.ApplePayPaymentToken;
import GooglePaymentData = google.payments.api.PaymentData;
import GooglePaymentDataRequest = google.payments.api.PaymentDataRequest;
import GoogleTransactionInfo = google.payments.api.TransactionInfo;

export interface IBraintreeClient {
    client: {
        create: IBraintreeClientCreate;
    };
    applePay: {
        create: IBraintreeApplePayCreate
    }
    googlePayment: {
        create: IBraintreeGooglePayCreate
    }
}

export interface IBraintreeClientCreateRequest {
    authorization: string;
}

export interface IBraintreeApplePayCreateRequest {
    client: IBraintreeClientInstance;
}

export interface IBraintreeGooglePayCreateRequest {
    client: IBraintreeClientInstance;
    googlePayVersion: number;
    googleMerchantId: string;
}

export interface IBraintreeApplePayPerformValidationRequest {
    validationURL: string;
    displayName: string;
}

export interface IBraintreeApplePayPaymentAuthorizedRequest {
    token: ApplePayPaymentToken;
}

export interface IBraintreeApplePayPaymentRequest {
    total: {amount: string, label: string};
    lineItems: Array<{amount: string, label: string}>;
    currencyCode: string;
    requiredBillingContactFields: IBraintreeRequiredContactField;
    requiredShippingContactFields: IBraintreeRequiredContactField;
}

export interface IBraintreeApplePayInstance {
    createPaymentRequest: (request: IBraintreeApplePayPaymentRequest) => ApplePayPaymentRequest;
    tokenize: (request: IBraintreeApplePayPaymentAuthorizedRequest, callback?: IBraintreeApplePayPaymentAuthorizedCallback) => Promise<IBraintreeApplePayPaymentAuthorizedResponse>;
    performValidation: (request: IBraintreeApplePayPerformValidationRequest, callback?: IBraintreeApplePayPerformValidationCallback) => Promise<unknown>;
}

export interface IBraintreeGooglePayPaymentRequest {
    transactionInfo: GoogleTransactionInfo;
}

export interface IBraintreeGooglePayPaymentData {
    nonce: string;
    type: 'AndroidPayCard' | 'PayPalAccount';
    paymentData: Record<string, unknown>;
}

export interface IBraintreeGooglePayInstance {
    createPaymentDataRequest: (request?: IBraintreeGooglePayPaymentRequest) => GooglePaymentDataRequest;
    parseResponse: (request: GooglePaymentData) => Promise<IBraintreeGooglePayPaymentData>;
}

export interface IBraintreeApplePayPaymentAuthorizedResponse {
    nonce: string;
    type: string;
    description: string;
    consumed: boolean;
    details: {
        cardType: string;
        cardholderName: string;
        dpanLastTwo: string;
        paymentInstrumentName: string;
    }
}

export type IBraintreeRequiredContactField = Array<'postalAddress' | 'email' | 'phone'>;
export type IBraintreeClientInstance = Record<string, unknown>;
export type IBraintreeClientCreateCallback = (error: string | Error | undefined, instance: IBraintreeClientInstance) => void;
export type IBraintreeApplePayCreateCallback = (error: string | Error | undefined, instance: IBraintreeApplePayInstance) => void;
export type IBraintreeGooglePayCreateCallback = (error: string | Error | undefined, instance: IBraintreeGooglePayInstance) => void;
export type IBraintreeApplePayPerformValidationCallback = (error: string | Error | undefined, merchantSession: unknown) => void;
export type IBraintreeApplePayPaymentAuthorizedCallback = (error: string | Error | undefined, payload: IBraintreeApplePayPaymentAuthorizedResponse | undefined) => void;
export type IBraintreeClientCreate = (request: IBraintreeClientCreateRequest, callback?: IBraintreeClientCreateCallback) => IBraintreeClientInstance;
export type IBraintreeApplePayCreate = (request: IBraintreeApplePayCreateRequest, callback?: IBraintreeApplePayCreateCallback) => IBraintreeApplePayInstance;
export type IBraintreeGooglePayCreate = (request: IBraintreeGooglePayCreateRequest, callback?: IBraintreeGooglePayCreateCallback) => IBraintreeGooglePayInstance;
