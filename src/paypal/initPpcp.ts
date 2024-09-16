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
import {initPPCPGoogle} from 'src/paypal/ppcp_google';
import {IExpressPayBraintreeGoogle} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

export async function initPpcp(callback?: IOnAction, fastlane = false): Promise<void> {

    if (callback) {
        setOnAction(callback);
    }
    const {alternative_payment_methods} = getOrderInitialData();
    const payment = alternative_payment_methods.find(payment => payment.type === alternatePaymentMethodType.PPCP);

    if(payment) {
        await initPpcpButtons(payment as IExpressPayPaypalCommercePlatformButton, fastlane);
        const applePayment = alternative_payment_methods.find(payment => payment.type === alternatePaymentMethodType.PPCP_APPLE);
        if(applePayment){
            await initPPCPApple(applePayment as IExpressPayPaypalCommercePlatform);
        }
        const ppcpPayment = payment as IExpressPayBraintreeGoogle;
        if(ppcpPayment.google_pay_enabled) {
            await initPPCPGoogle(payment as IExpressPayPaypalCommercePlatform);
        }
    } else {
        displayError('There was an unknown error while loading the paypal buttons. Please try again.', 'generic', 'unknown_error');
        enableDisableSection( showPaymentMethodTypes.PPCP, true);
    }
}
