import {
    IExpressPayBraintreeApple,
    IExpressPayBraintreeGoogle,
    IExpressPayPaypalCommercePlatform
} from '@bold-commerce/checkout-frontend-library';
import {PayPalNamespace} from '@paypal/paypal-js';
import {AmountWithBreakdown, OrderResponseBody, ShippingInfoOption} from '@paypal/paypal-js/types/apis/orders';
import {IBraintreeApplePayInstance, IBraintreeClient, IBraintreeGooglePayInstance} from 'src/types/braintree';
import {IPaypalNamespaceApple, IPPCPApplePayInstance} from 'src/types/paypal';
import GooglePaymentsClient = google.payments.api.PaymentsClient;
import ApplePayErrorCode = ApplePayJS.ApplePayErrorCode;
import ErrorReason = google.payments.api.ErrorReason;
import TransactionState = google.payments.api.TransactionState;
import CallbackIntent = google.payments.api.CallbackIntent;
import CallbackTrigger = google.payments.api.CallbackTrigger;

export interface IShowPaymentMethods {
    stripe: boolean;
    paypal: boolean;
    braintreeApple: boolean;
    braintreeGoogle: boolean;
    ppcpApple: boolean;
}

export interface IShowPaymentMethodTypes {
    STRIPE: string;
    PAYPAL: string;
    BRAINTREE_GOOGLE: string;
    BRAINTREE_APPLE: string;
    PPCP_APPLE: string;
}

export type IOnAction = (actionType: string, payload?: Record<string, unknown>) => void;

export interface IExpressPayContext {
    onAction: IOnAction | null;
}

export interface IActionTypes {
    ENABLE_DISABLE_SECTION: string;
    ORDER_COMPLETED: string;
    ORDER_PROCESSING: string;
    DISPLAY_ERROR: string;
}

export interface IPaypalState {
    paypal: PayPalNamespace | IPaypalNamespaceApple | null;
    gatewayPublicId: string;
    ppcpAppleCredentials: IExpressPayPaypalCommercePlatform | null;
    ppcpApplePayInstance: IPPCPApplePayInstance | null;
}

export interface IPaypalConstants {
    MAX_SHIPPING_OPTIONS_LENGTH: number;
    MAX_STRING_LENGTH: number;
    APPLEPAY_VERSION_NUMBER: number;
    APPLEPAY_JS: string;
}

export interface IPaypalPatchOperation {
    op: 'replace' | 'add';
    path: string;
    value: AmountWithBreakdown | Array<ShippingInfoOption>
}

export type IPaypalPatch = (operations: Array<IPaypalPatchOperation>) => Promise<OrderResponseBody>;

export interface IBraintreeState {
    braintree: IBraintreeClient | null;
    googlePayClient: GooglePaymentsClient | null;
    googlePayInstance: IBraintreeGooglePayInstance | null;
    appleInstance: IBraintreeApplePayInstance | null;
    appleSession: ApplePaySession | null;
    googleCredentials: IExpressPayBraintreeGoogle | null;
    appleCredentials: IExpressPayBraintreeApple | null;
}

export interface IBraintreeConstants {
    BASE_JS_URL: string;
    GOOGLE_JS_URL: string;
    CLIENT_JS: string;
    APPLE_JS: string;
    GOOGLE_JS: string;
    DATA_COLLECTOR_JS: string;
    JS_VERSION: string;
    APPLEPAY_VERSION_NUMBER: number;
    APPLEPAY_ERROR_CODE_SHIPPING_CONTACT: ApplePayErrorCode;
    APPLEPAY_ERROR_CODE_BILLING_CONTACT: ApplePayErrorCode;
    APPLEPAY_ERROR_CODE_UNKNOWN: ApplePayErrorCode;
    GOOGLEPAY_ERROR_REASON_SHIPPING: ErrorReason;
    GOOGLEPAY_ERROR_REASON_PAYMENT: ErrorReason;
    GOOGLEPAY_TRANSACTION_STATE_SUCCESS: TransactionState;
    GOOGLEPAY_TRANSACTION_STATE_ERROR: TransactionState;
    GOOGLEPAY_INTENT_SHIPPING_ADDRESS: CallbackIntent;
    GOOGLEPAY_INTENT_SHIPPING_OPTION: CallbackIntent;
    GOOGLEPAY_INTENT_PAYMENT_AUTHORIZATION: CallbackIntent;
    GOOGLEPAY_TRIGGER_INITIALIZE: CallbackTrigger;
    GOOGLEPAY_VERSION_NUMBER: number;
    GOOGLEPAY_VERSION_NUMBER_MINOR: number;
}

export interface IBraintreeUrls {
    appleJsURL: string;
    clientJsURL: string;
    dataCollectorJsURL: string;
    googleJsUrl: string;
    braintreeGoogleJsURL: string;
}

export interface ITotals {
    totalSubtotal: number,
    totalOrder: number,
    totalAmountDue: number,
    totalPaid: number,
    totalDiscounts: number,
    totalTaxes: number,
    totalFees: number,
    totalAdditionalFees: number
}
