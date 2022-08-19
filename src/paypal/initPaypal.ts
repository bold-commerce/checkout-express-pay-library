import {
    getCurrency,
    IExpressPayPaypal
} from '@bold-commerce/checkout-frontend-library';
import {getPaypalUrl, paypalOnload} from 'src';

export function initPaypal(payment: IExpressPayPaypal, showHideExpressPaymentSection?: (show: boolean) => void): void{
    const currency = getCurrency();
    const src = getPaypalUrl(payment.client_id, payment.is_test, currency.iso_code);
    const existentScriptElement = document.querySelector(`[src="${src}"]`);

    if (!existentScriptElement) {
        const script = document.createElement('script');
        script.setAttribute('data-namespace', 'paypal_direct');
        script.src = src;
        script.onload = async () => await paypalOnload(payment, showHideExpressPaymentSection);
        document.head.appendChild(script);
    }
}
