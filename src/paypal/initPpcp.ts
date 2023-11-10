import {
    alternatePaymentMethodType,
    getOrderInitialData,
    IExpressPayPaypalCommercePlatform,
    IExpressPayPaypalCommercePlatformButton
} from '@boldcommerce/checkout-frontend-library';
import {
    displayError,
    enableDisableSection,
    initPPCPApple,
    initPpcpButtons,
    IOnAction,
    setOnAction,
    showPaymentMethodTypes
} from 'src';

export async function initPpcp(callback?: IOnAction): Promise<void> {

    if (callback) {
        setOnAction(callback);
    }
    const {alternative_payment_methods} = getOrderInitialData();
    const payment = alternative_payment_methods.find(payment => payment.type === alternatePaymentMethodType.PPCP);

    if(payment) {
        await initPpcpButtons(payment as IExpressPayPaypalCommercePlatformButton);
        const applePayment = alternative_payment_methods.find(payment => payment.type === alternatePaymentMethodType.PPCP_APPLE);
        if(applePayment){
            await initPPCPApple(applePayment as IExpressPayPaypalCommercePlatform);
        }
    } else {
        displayError('There was an unknown error while loading the paypal buttons. Please try again.', 'generic', 'unknown_error');
        enableDisableSection( showPaymentMethodTypes.PPCP, true);
    }
}
