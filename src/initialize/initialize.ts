import {
    alternatePaymentMethodType,
    getOrderInitialData,
    IExpressPayBraintreeApple,
    IExpressPayBraintreeGoogle,
    IExpressPayPaypal,
    IExpressPayStripe
} from '@bold-commerce/checkout-frontend-library';
import {initStripe, initPaypal, IInitializeProps, setOnAction, initBraintreeApple, initBraintreeGoogle} from 'src';

export function initialize(props: IInitializeProps): void{
    const {alternative_payment_methods} = getOrderInitialData();
    setOnAction(props.onAction);

    if(alternative_payment_methods){
        alternative_payment_methods.forEach(paymentMethod => {
            const type = paymentMethod.type;
            switch (type){
                case alternatePaymentMethodType.STRIPE:
                    initStripe(paymentMethod as IExpressPayStripe);
                    break;
                case alternatePaymentMethodType.PAYPAL:
                    initPaypal(paymentMethod as IExpressPayPaypal);
                    break;
                case 'braintree':
                    initBraintreeGoogle(paymentMethod as IExpressPayBraintreeGoogle);
                    break;
                case alternatePaymentMethodType.BRAINTREE_APPLE:
                    initBraintreeApple(paymentMethod as IExpressPayBraintreeApple);
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.log('do nothing'); // TODO Implement the default behaviour.
                    break;
            }
        });
    }
}
