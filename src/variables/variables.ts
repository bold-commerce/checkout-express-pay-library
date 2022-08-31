import {IActionTypes, IExpressPayContext, IShowPaymentMethods, IPaypalState} from 'src/types/variables';

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
    button: null
};
