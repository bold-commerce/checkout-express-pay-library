import {
    getApplicationState,
    getCurrency,
    getOrderInitialData,
    IExpressPayStripe
} from '@bold-commerce/checkout-frontend-library';
import {getStripeDisplayItem} from 'src/stripe';

export function initStripe(payment: IExpressPayStripe, showHideExpressPaymentSection?: (show: boolean) => void): void{

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = async () => await stripeOnload(payment, showHideExpressPaymentSection);
    document.head.appendChild(script);
}

export async function stripeOnload(payment: IExpressPayStripe, showHideExpressPaymentSection?: (show: boolean) => void): Promise<void> {

    const currency = getCurrency();
    const {order_total} = getApplicationState();
    const {general_settings} = getOrderInitialData();
    const country = payment.account_country;
    const displayItems = getStripeDisplayItem();

    const stripeInstance = window['Stripe'](payment.key, {stripeAccount: payment.stripe_user_id} );
    const paymentRequest = stripeInstance.paymentRequest({
        currency: currency.iso_code.toLowerCase(),
        country: country,
        total: {
            label: 'Total',
            amount: order_total,
        },
        //requestShipping: true, TODO CE-492 - uncomment it and add address & shipping listeners.
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: general_settings.checkout_process.phone_number_required,
        displayItems: displayItems
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
