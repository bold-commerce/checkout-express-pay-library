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
    DISPLAY_ERROR: 'DISPLAY_ERROR',
};

export const paypalState: IPaypalState = {
    paypal: null,
    gatewayPublicId: '',
    MAX_SHIPPING_OPTIONS_LENGTH: 10,
    MAX_STRING_LENGTH: 127,
};
