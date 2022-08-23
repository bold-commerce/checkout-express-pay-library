import {
    alternatePaymentMethodType,
    getOrderInitialData,
    IExpressPayPaypal,
    IExpressPayStripe
} from '@bold-commerce/checkout-frontend-library';
import {initStripe, initPaypal, showHideExpressPaySection, IInitializeProps} from 'src';

export function initialize(props: IInitializeProps): void{
    const {alternate_payment_methods} = getOrderInitialData();

    if(alternate_payment_methods){
        alternate_payment_methods.forEach(paymentMethod => {
            const type = paymentMethod.type;
            const showCallback = (show: boolean) => showHideExpressPaySection(type, show, props.showHideExpressPaymentSection);
            switch (type){
                case alternatePaymentMethodType.STRIPE:
                    initStripe(paymentMethod as IExpressPayStripe, showCallback);
                    break;
                case alternatePaymentMethodType.PAYPAL:
                    initPaypal(paymentMethod as IExpressPayPaypal, showCallback);
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.log('do nothing'); // TODO Implement the default behaviour.
                    break;
            }
        });
    }
}
