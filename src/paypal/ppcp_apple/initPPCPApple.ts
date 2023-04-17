import {IExpressPayPaypalCommercePlatform} from '@bold-commerce/checkout-frontend-library';
import {loadScript} from '@paypal/paypal-js';
import {PayPalScriptOptions} from '@paypal/paypal-js/types/script-options';
import {
    getPaypalScriptOptions,
    hasPaypalNameSpaceApple,
    loadJS,
    paypalConstants,
    ppcpOnLoadApple,
    setPaypalNameSpace,
    setPPCPAppleCredentials
} from 'src';

export async function initPPCPApple(payment: IExpressPayPaypalCommercePlatform): Promise<void>  {

    setPPCPAppleCredentials(payment);

    if (window.ApplePaySession
        && window.ApplePaySession.supportsVersion(paypalConstants.APPLEPAY_VERSION_NUMBER)
        && window.ApplePaySession.canMakePayments()
    ) {
        if (!hasPaypalNameSpaceApple()) {
            const components = payment.apple_pay_enabled ? 'applepay' : undefined;
            const paypalScriptOptions: PayPalScriptOptions = getPaypalScriptOptions(payment.partner_id, payment.is_test, payment.merchant_id, components);

            await loadJS(paypalConstants.APPLEPAY_JS);
            const paypal = await loadScript(paypalScriptOptions);

            setPaypalNameSpace(paypal);

            if (paypal) {
                ppcpOnLoadApple();
            }
        } else {
            await loadJS(paypalConstants.APPLEPAY_JS, ppcpOnLoadApple);
        }
    }
}
