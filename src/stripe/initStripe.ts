import {
    getApplicationState,
    getCurrency,
    IExpressPayStripe
} from '@bold-commerce/checkout-frontend-library';

export function initStripe(payment: IExpressPayStripe, showHideExpressPaymentSection?: (show: boolean) => void): void{

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = async () => await stripeOnload(payment, showHideExpressPaymentSection);
    document.head.appendChild(script);
}

export async function stripeOnload(payment: IExpressPayStripe, showHideExpressPaymentSection?: (show: boolean) => void): Promise<void> {

    const currency = getCurrency();
    const {order_total} = getApplicationState();
    const country = payment.account_country;

    const stripeInstance = window['Stripe'](payment.key);
    const paymentRequest = stripeInstance.paymentRequest({
        currency: currency.iso_code.toLowerCase(),
        country: country,
        total: {
            label: 'Total',
            amount: order_total,
        },
        requestPayerName: true,
        requestPayerEmail: true,
    });
    const elements = stripeInstance.elements();
    const stripeButton = elements.create('paymentRequestButton', {
        paymentRequest: paymentRequest,
        style: {
            paymentRequestButton: {
                type: 'default',
                theme: 'dark',
            },
        },
    });

    // creating a stripe payment div inside express payment container
    const stripeDiv = document.createElement('div');
    stripeDiv.id = 'stripe-express-payment';
    stripeDiv.className = 'stripe-express-payment express-payment';
    document.getElementById('express-payment-container')?.appendChild(stripeDiv);


    const result: boolean = await paymentRequest.canMakePayment();

    if (result) {
        stripeButton.mount('#stripe-express-payment');
        if (showHideExpressPaymentSection) {
            showHideExpressPaymentSection(true);
        }
    } else {
        stripeDiv.style.display = 'none';
    }

}
