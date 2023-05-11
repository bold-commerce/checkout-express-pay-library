import {PayPalNamespace} from '@paypal/paypal-js';
import ApplePayMerchantCapability = ApplePayJS.ApplePayMerchantCapability;
import ApplePayPaymentToken = ApplePayJS.ApplePayPaymentToken;
import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;

export interface IPaypalNamespaceApple extends PayPalNamespace {
    Applepay: () => IPPCPApplePayInstance;
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
