import {
    alternatePaymentMethodType,
    getOrderInitialData,
    IExpressPayStripe
} from '@bold-commerce/checkout-frontend-library';
import {initStripe, IInitializeProps} from 'src';

export function initialize(props: IInitializeProps): void{
    const {alternate_payment_methods} = getOrderInitialData();

    if(alternate_payment_methods){
        alternate_payment_methods.forEach(paymentMethod => {
            const type = paymentMethod.type;
            switch (type){
                case alternatePaymentMethodType.STRIPE:
                    initStripe(paymentMethod as IExpressPayStripe , props.showHideExpressPaymentSection);
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.log('do nothing');
                    break;
            }
        });
    }

}
