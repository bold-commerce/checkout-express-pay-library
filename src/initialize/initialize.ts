import {
    alternatePaymentMethodType,
    getOrderInitialData,
    IExpressPayBraintreeApple,
    IExpressPayBraintreeGoogle,
    IExpressPayPaypal,
    IExpressPayPaypalCommercePlatform,
    IExpressPayStripe,
} from '@boldcommerce/checkout-frontend-library';
import {
    IInitializeProps,
    initBraintreeApple,
    initBraintreeGoogle,
    initStripe,
    initPaypal,
    setOnAction,
    initPPCPApple,
    initPpcp,
} from 'src';

export function initialize(props: IInitializeProps): void{
    let {alternative_payment_methods} = getOrderInitialData();
    setOnAction(props.onAction);

    if (alternative_payment_methods) {
        // Removing ApplePay from the methods if PPCP is one of the methods since PPCP loads ApplePay
        const loadsPpcp = alternative_payment_methods.some(payment => payment.type === alternatePaymentMethodType.PPCP);
        if (loadsPpcp) {
            alternative_payment_methods = alternative_payment_methods
                .filter(m => m.type !== alternatePaymentMethodType.PPCP_APPLE);
        }

        for (const paymentMethod of alternative_payment_methods) {
            const type = paymentMethod.type;
            switch (type){
                case alternatePaymentMethodType.STRIPE:
                    initStripe(paymentMethod as IExpressPayStripe);
                    break;
                case alternatePaymentMethodType.PAYPAL:
                    initPaypal(paymentMethod as IExpressPayPaypal);
                    break;
                case alternatePaymentMethodType.BRAINTREE_GOOGLE:
                    initBraintreeGoogle(paymentMethod as IExpressPayBraintreeGoogle);
                    break;
                case alternatePaymentMethodType.BRAINTREE_APPLE:
                    initBraintreeApple(paymentMethod as IExpressPayBraintreeApple);
                    break;
                case alternatePaymentMethodType.PPCP_APPLE:
                    initPPCPApple(paymentMethod as IExpressPayPaypalCommercePlatform);
                    break;
                case alternatePaymentMethodType.PPCP:
                    initPpcp(props.onAction, !!props.fastlane);
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.log('do nothing'); // TODO Implement the default behaviour.
                    break;
            }
        }
    }
}
