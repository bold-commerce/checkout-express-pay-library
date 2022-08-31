import {PayPalNamespace} from '@paypal/paypal-js';
import {PayPalButtonsComponent} from '@paypal/paypal-js/types/components/buttons';

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
    button: PayPalButtonsComponent | null;
}
