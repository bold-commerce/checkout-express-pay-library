import { IFastlaneInstance, IFastlaneStyleOptions } from './fastlane';
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
        create: IBraintreeApplePayCreate;
    };
    googlePayment: {
        create: IBraintreeGooglePayCreate;
    };
    paypalCheckout: {
        create: IBraintreePaypalCheckoutCreate;
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

export interface IBraintreePaypalCheckoutCreate {
    (config: {
        client: IBraintreeClientInstance,
        authorization?: string;
        merchantAccountId?: string;
        autoSetDataUserIdToken?: boolean;
    }): Promise<IBraintreePaypalCheckoutInstance>;
}

export interface IBraintreePaypalCheckoutInstance {
    createPayment: (config: {
        flow: string;
        intent?: string;
        offerCredit?: boolean;
        amount?: string | number;
        currency?: string;
        displayName?: string;
        requestBillingAgreement?: boolean;
        billingAgreementDetails?: { description?: string };
        vaultInitiatedCheckoutPaymentMethodToken?: string;
        shippingOptions?: Array<unknown>;
        enableShippingAddress?: boolean;
        shippingAddressOverride?: {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            postalCode: string;
            countryCode: string;
            phone?: string;
            recipientName?: string;
        };
        shippingAddressEditable?: boolean;
        billingAgreementDescription?: string;
        landingPageType?: string;
        lineItems?: {
            quantity: string,
            unitAmount: string,
            name: string,
            kind: string,
            unitTaxAmount?: string,
            description?: string,
            productCode?: string,
            url?: string,
        }[];
    }) => Promise<string>;
    updatePayment: (config: {
        paymentId: string;
        amount: string | number;
        currency?: string;
        shippingOptions?: {
            id: string;
            label: string;
            selected: boolean;
            type: 'SHIPPING' | 'PICKUP';
            amount: {
                currency: string;
                value: string;
            };
        }[];
        lineItems?: {
            quantity: string,
            unitAmount: string,
            name: string,
            kind: string,
            unitTaxAmount?: string,
            description?: string,
            productCode?: string,
            url?: string,
        }[];
        amountBreakdown?: {
            itemTotal?: string;
            shipping?: string;
            handling?: string;
            taxTotal?: string;
            insurance?: string;
            shippingDiscount?: string;
            discount?: string;
        };
    }) => Promise<string>;
    tokenizePayment: (config: {
        payerId: string;
        paymentId?: string;
        billingToken?: string;
        vault?: boolean;
    }) => Promise<TokenizePaymentResult>;
    getClientId: () => Promise<string>;
    loadPayPalSDK: (options?: {
        'client-id'?: string;
        intent?: string;
        locale?: string;
        currency?: string;
        vault?: boolean;
        components?: string;
        dataAttributes?: {
            'client-token'?: string;
            'csp-nonce'?: string;
        }
    }) => Promise<IBraintreePaypalCheckoutInstance>
}

export interface TokenizePaymentResult {
    nonce: string;
    type: string;
    details: {
        shippingAddress?: {
            recipientName: string;
            line1: string;
            line2?: string;
            city: string;
            state: string;
            countryCode: string;
            postalCode: string;

        };
        email: string;
        firstName: string;
        lastName: string;
        countryCode: string;
        payerId: string;
        phone: string;
        billingAddress: {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            countryCode: string;
            postalCode: string;

        };
        tenant: string;
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