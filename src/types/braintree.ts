import {IFastlaneInstance, IFastlaneStyleOptions} from './fastlane';
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
    };
    googlePayment: {
        create: IBraintreeGooglePayCreate
    };
    dataCollector: {
        create: (_: {
            client: IBraintreeClientInstance;
            riskCorrelationId?: string;
        }) => Promise<IBraintreeDataCollectorInstance>;
    };
    fastlane: {
        create: IBraintreeFastlaneCreate;
    };
}

export interface IBraintreeFastlaneCreateRequest {
    authorization: string;
    client: IBraintreeClientInstance;
    deviceData: unknown;
    metadata?: {
        geoLocOverride: string;
    };
    styles: IFastlaneStyleOptions|undefined
} 

export interface IBraintreeDataCollectorCreateRequest {
    client: IBraintreeClientInstance;
    riskCorrelationId?: string;
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

export interface IBraintreeDataCollectorInstance {
    deviceData: unknown;
}

export type IBraintreeRequiredContactField = Array<'postalAddress' | 'email' | 'phone'>;
export type IBraintreeClientInstance = Record<string, unknown>;
export type IBraintreeClientCreateCallback = (error: string | Error | undefined, instance: IBraintreeClientInstance) => void;
export type IBraintreeApplePayCreateCallback = (error: string | Error | undefined, instance: IBraintreeApplePayInstance) => void;
export type IBraintreeGooglePayCreateCallback = (error: string | Error | undefined, instance: IBraintreeGooglePayInstance) => void;
export type IBraintreeApplePayPerformValidationCallback = (error: string | Error | undefined, merchantSession: unknown) => void;
export type IBraintreeApplePayPaymentAuthorizedCallback = (error: string | Error | undefined, payload: IBraintreeApplePayPaymentAuthorizedResponse | undefined) => void;
export type IBraintreeClientCreate = (request: IBraintreeClientCreateRequest, callback?: IBraintreeClientCreateCallback) => Promise<IBraintreeClientInstance>;
export type IBraintreeApplePayCreate = (request: IBraintreeApplePayCreateRequest, callback?: IBraintreeApplePayCreateCallback) => IBraintreeApplePayInstance;
export type IBraintreeGooglePayCreate = (request: IBraintreeGooglePayCreateRequest, callback?: IBraintreeGooglePayCreateCallback) => Promise<IBraintreeGooglePayInstance>;
export type IBraintreeFastlaneCreate = (request: IBraintreeFastlaneCreateRequest) => Promise<IFastlaneInstance>;
export type IBraintreeDataCollectorCreate = (request: IBraintreeDataCollectorCreateRequest) => Promise<IBraintreeDataCollectorInstance>;