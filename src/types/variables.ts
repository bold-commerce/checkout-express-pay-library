import {PayPalNamespace} from '@paypal/paypal-js';
import {AmountWithBreakdown, OrderResponseBody, ShippingInfoOption} from '@paypal/paypal-js/types/apis/orders';

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
    MAX_SHIPPING_OPTIONS_LENGTH: number;
    MAX_STRING_LENGTH: number;
}

export interface IPaypalPatchOperation {
    op: 'replace' | 'add';
    path: string;
    value: AmountWithBreakdown | Array<ShippingInfoOption>
}

export type IPaypalPatch = (operations: Array<IPaypalPatchOperation>) => Promise<OrderResponseBody>;
