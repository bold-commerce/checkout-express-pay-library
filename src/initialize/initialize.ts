import {
    alternatePaymentMethodType,
    getOrderInitialData,
    IExpressPayPaypal,
    IExpressPayStripe
} from '@bold-commerce/checkout-frontend-library';
import {initStripe, initPaypal, IInitializeProps, setOnAction} from 'src';

export function initialize(props: IInitializeProps): void{
    const {alternate_payment_methods} = getOrderInitialData();
    setOnAction(props.onAction);

    if(alternate_payment_methods){
        alternate_payment_methods.forEach(paymentMethod => {
            const type = paymentMethod.type;
            switch (type){
                case alternatePaymentMethodType.STRIPE:
                    initStripe(paymentMethod as IExpressPayStripe);
                    break;
                case alternatePaymentMethodType.PAYPAL:
                    initPaypal(paymentMethod as IExpressPayPaypal);
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.log('do nothing'); // TODO Implement the default behaviour.
                    break;
            }
        });
    }
}
