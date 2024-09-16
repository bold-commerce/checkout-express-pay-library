import {PayPalNamespace} from '@paypal/paypal-js';
import ApplePayMerchantCapability = ApplePayJS.ApplePayMerchantCapability;
import ApplePayPaymentToken = ApplePayJS.ApplePayPaymentToken;
import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;
import GooglePaymentData = google.payments.api.PaymentData;
import GooglePaymentDataRequest = google.payments.api.PaymentDataRequest;
import GoogleTransactionInfo = google.payments.api.TransactionInfo;
import PaymentMethodSpecification = google.payments.api.PaymentMethodSpecification;
import MerchantInfo = google.payments.api.MerchantInfo;
import {IBraintreeGooglePayPaymentData} from 'src/types/braintree';
import PaymentData = google.payments.api.PaymentData;
import PaymentMethodData = google.payments.api.PaymentMethodData;
import {Address} from '@paypal/paypal-js/types/apis/commons';

export interface IPaypalNamespaceApple extends PayPalNamespace {
    Applepay: () => IPPCPApplePayInstance;
}

export interface IPaypalNamespaceGoogle extends PayPalNamespace {
    Googlepay: () => IPPCPGooglePayInstance;
}

export interface IPPCPApplePayInstanceValidateMerchantParam {
    validationUrl: string;
    displayName: string;
}

export interface IPPCPApplePayInstanceConfirmOrderParam {
    orderId: string;
    token: ApplePayPaymentToken;
    billingContact?: ApplePayPaymentContact;
    shippingContact?: ApplePayPaymentContact;
}

export interface IPPCPGooglePayInstanceConfirmOrderParam {
    orderId: string;
    paymentMethodData: PaymentMethodData;
    billingAddress?: Address;
    shippingAddress?: Address;
    email?: string,
}

export interface IPPCPApplePayInstance {
    config: () => Promise<IPPCPAppleConfig>;
    validateMerchant: (validateMerchantParam: IPPCPApplePayInstanceValidateMerchantParam) => Promise<IPPCPApplePayValidateMerchantResponse>;
    confirmOrder: (confirmOrderParam: IPPCPApplePayInstanceConfirmOrderParam) => Promise<unknown>;
}

export interface IPPCPApplePayValidateMerchantResponse {
    merchantSession: unknown;
}

export interface IPPCPAppleConfig {
    isEligible: boolean;
    countryCode: string;
    merchantCapabilities: Array<ApplePayMerchantCapability>;
    supportedNetworks: Array<string>;
}
export interface IPPCPGooglePayPaymentData {
    nonce: string;
    type: 'AndroidPayCard' | 'PayPalAccount';
    paymentData: Record<string, unknown>;
}

export interface IPPCPGooglePayInstance {
    config: () => Promise<IPPCPGoogleConfig>;
    confirmOrder: (confirmOrderParam: IPPCPGooglePayInstanceConfirmOrderParam) => Promise<unknown>;
}

export interface IPPCPGoogleConfig {
    apiVersion: number;
    apiVersionMinor: number;
    countryCode: string,
    merchantInfo: MerchantInfo;
    allowedPaymentMethods: Array<PaymentMethodSpecification>;
}
