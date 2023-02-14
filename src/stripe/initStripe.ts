import {
    getCurrency,
    getOrderInitialData,
    IExpressPayStripe
} from '@bold-commerce/checkout-frontend-library';
import {
    addStripePayment,
    changeStripeShippingLines,
    checkStripeAddress,
    getPaymentRequestDisplayItems,
    enableDisableSection,
    IStripeEvent,
    IStripePaymentEvent,
    loadJS,
    showPaymentMethodTypes,
    getTotals
} from 'src';

export async function initStripe(payment: IExpressPayStripe): Promise<void> {

    const src = 'https://js.stripe.com/v3/';
    const onLoad = async () => await stripeOnload(payment);
    await loadJS(src, onLoad);
}

export async function stripeOnload(payment: IExpressPayStripe): Promise<void> {
    const currency = getCurrency();
    const {totalAmountDue} = getTotals();
    const {general_settings} = getOrderInitialData();
    const country = payment.account_country;
    const displayItems = getPaymentRequestDisplayItems();
    const {country_info: countryInfo} = getOrderInitialData();
    const phoneNumberRequired = general_settings.checkout_process.phone_number_required;
    const allowedShippingCountries = countryInfo.filter(c => c.valid_for_shipping);
    const allowedCountryCodes = allowedShippingCountries.map(c => c.iso_code.toUpperCase());

    const stripeInstance = window['Stripe'](payment.key, {stripeAccount: payment.stripe_user_id} );
    const paymentRequest = stripeInstance.paymentRequest({
        currency: currency.iso_code.toLowerCase(),
        country: country,
        total: {
            label: 'Total',
            amount: totalAmountDue,
        },
        requestShipping: true,
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: phoneNumberRequired,
        displayItems: displayItems
    });
    paymentRequest.shippingAddressParameters = {allowedCountryCodes, phoneNumberRequired};

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
        enableDisableSection( showPaymentMethodTypes.STRIPE, true);
    } else {
        stripeDiv.style.display = 'none';
    }

    paymentRequest.addEventListener('shippingaddresschange', async (event: IStripeEvent) => {
        await checkStripeAddress(event);
    }, false);

    paymentRequest.addEventListener('shippingoptionchange', async (event: IStripeEvent) => {
        await changeStripeShippingLines(event);
    }, false);

    paymentRequest.addEventListener('token', async (event: IStripePaymentEvent) => {
        return new Promise( function (resolve, reject) {
            addStripePayment(event, payment.public_id).then(resolve, reject);
            setTimeout(reject, 29999);
        });
    }, false);

}
