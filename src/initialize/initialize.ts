import {alternatePaymentMethodType, getOrderInitialData} from '@bold-commerce/checkout-frontend-library';

export function initialize(): void{
    const {alternate_payment_methods} = getOrderInitialData();

    if(alternate_payment_methods){
        alternate_payment_methods.forEach(paymentMethod => {
            const type = paymentMethod.type;
            switch (type){
                case alternatePaymentMethodType.STRIPE:
                    // eslint-disable-next-line no-console
                    console.log('implement stripe'); // TODO CE-497
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.log('do nothing');
                    break;
            }
        });
    }

}
