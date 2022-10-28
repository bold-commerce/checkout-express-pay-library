import {IExpressPayPaypal} from '@bold-commerce/checkout-frontend-library';
import {loadScript} from '@paypal/paypal-js';
import {PayPalScriptOptions} from '@paypal/paypal-js/types/script-options';
import {
    getPaypalScriptOptions,
    hasPaypalNameSpace,
    paypalOnload,
    setPaypalGatewayPublicId,
    setPaypalNameSpace
} from 'src';

export async function initPaypal(payment: IExpressPayPaypal): Promise<void> {
    setPaypalGatewayPublicId(payment.public_id);
    if (!hasPaypalNameSpace()) {
        const paypalScriptOptions: PayPalScriptOptions = getPaypalScriptOptions(payment.client_id, payment.is_test);
        const paypal = await loadScript(paypalScriptOptions);

        setPaypalNameSpace(paypal);

        if (paypal) {
            await paypalOnload(payment);
        }
    } else {
        await paypalOnload(payment);
    }
}
