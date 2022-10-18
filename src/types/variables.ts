import {PayPalNamespace} from '@paypal/paypal-js';
import {AmountWithBreakdown, OrderResponseBody, ShippingInfoOption} from '@paypal/paypal-js/types/apis/orders';
import {IExpressPayBraintreeApple, IExpressPayBraintreeGoogle} from '@bold-commerce/checkout-frontend-library';

export interface IShowPaymentMethods {
    stripe: boolean;
    paypal: boolean;
}

export type IOnAction = (actionType: string, payload?: Record<string, unknown>) => void;

export interface IExpressPayContext {
    onAction: IOnAction | null;
}

export interface IActionTypes {
    ENABLE_DISABLE_SECTION: string;
    ORDER_COMPLETED: string;
    ORDER_PROCESSING: string;
}

export interface IPaypalState {
    paypal: PayPalNamespace | null;
    gatewayPublicId: string;
}

export interface IPaypalConstants {
    MAX_SHIPPING_OPTIONS_LENGTH: number;
    MAX_STRING_LENGTH: number;
}

export interface IPaypalPatchOperation {
    op: 'replace' | 'add';
    path: string;
    value: AmountWithBreakdown | Array<ShippingInfoOption>
}

export type IPaypalPatch = (operations: Array<IPaypalPatchOperation>) => Promise<OrderResponseBody>;

export interface IBraintreeState {
    braintree: Record<string, unknown> | null;
    google: Record<string, unknown> | null;
    apple: Record<string, unknown> | null;
    googleCredentials: IExpressPayBraintreeGoogle | null;
    appleCredentials: IExpressPayBraintreeApple | null;
}

export interface IBraintreeConstants {
    BASE_JS_URL: string;
    GOOGLE_JS_URL: string;
    CLIENT_JS: string;
    APPLE_JS: string;
    DATA_COLLECTOR_JS: string;
    JS_VERSION: string;
}

export interface IBraintreeUrls {
    appleJsURL: string;
    clientJsURL: string;
    dataCollectorJsURL: string;
    googleJsUrl: string
}
