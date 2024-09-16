import {IExpressPayPaypalCommercePlatform} from '@boldcommerce/checkout-frontend-library';
import {loadScript} from '@paypal/paypal-js';
import {PayPalScriptOptions} from '@paypal/paypal-js/types/script-options';
import {
    getPaypalScriptOptions,
    hasPaypalNameSpaceGoogle,
    loadJS,
    paypalConstants,
    setPaypalNameSpace,
    setPPCPGoogleCredentials,
    ppcpOnLoadGoogle
} from 'src';

export async function initPPCPGoogle(payment: IExpressPayPaypalCommercePlatform): Promise<void>  {
    setPPCPGoogleCredentials(payment);

    if (!hasPaypalNameSpaceGoogle()) {
        const components = payment.google_pay_enabled ? 'googlepay' : undefined;
        const paypalScriptOptions: PayPalScriptOptions = getPaypalScriptOptions(payment.partner_id, payment.is_test, payment.merchant_id, components);

        await loadJS(paypalConstants.GOOGLEPAY_JS);
        const paypal = await loadScript(paypalScriptOptions);

        setPaypalNameSpace(paypal);

        if (paypal) {
            ppcpOnLoadGoogle();
        }
    } else {
        await loadJS(paypalConstants.GOOGLEPAY_JS, ppcpOnLoadGoogle);
    }
}
