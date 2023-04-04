import {IExpressPayPaypalCommercePlatform} from '@bold-commerce/checkout-frontend-library';
import {loadScript} from '@paypal/paypal-js';
import {PayPalScriptOptions} from '@paypal/paypal-js/types/script-options';
import {
    getPaypalScriptOptions,
    hasPaypalNameSpace,
    loadJS,
    paypalConstants,
    setPPCPAppleCredentials
} from 'src';

export async function initPPCPApple(payment: IExpressPayPaypalCommercePlatform): Promise<void>  {

    setPPCPAppleCredentials(payment);

    if (window.ApplePaySession
        && window.ApplePaySession.supportsVersion(paypalConstants.APPLEPAY_VERSION_NUMBER)
        && window.ApplePaySession.canMakePayments()
    ) {
        if (!hasPaypalNameSpace()) {
            const components = payment.apple_pay_enabled ? 'applepay' : undefined;
            const paypalScriptOptions: PayPalScriptOptions = getPaypalScriptOptions(payment.partner_id, payment.is_test, payment.merchant_id, components);

            await loadScript(paypalScriptOptions);
            await loadJS(paypalConstants.APPLEPAY_JS, () => {/*todo PPCPOnLoadApple*/});

        }
    }
}
