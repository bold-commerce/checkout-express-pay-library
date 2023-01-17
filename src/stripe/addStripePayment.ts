import {API_RETRY, IStripeAddress, IStripeCard, IStripePaymentEvent, IStripeToken} from 'src/types';
import {
    addPayment,
    getApplicationState,
    getOrderInitialData,
    IAddPaymentRequest,
    setBillingAddress,
    updateShippingAddress
} from '@bold-commerce/checkout-frontend-library';
import {
    formatStripeBillingAddress,
    callGuestCustomerEndpoint,
    getFirstAndLastName,
    orderProcessing,
    formatStripeShippingAddress
} from 'src';


export async function addStripePayment(event: IStripePaymentEvent, stripeGatewayId: string): Promise<void>  {
    const {order_total} = getApplicationState();
    const {general_settings} = getOrderInitialData();
    const phoneNumberRequired = general_settings.checkout_process.phone_number_required;
    const token = event.token as IStripeToken;
    const card = token.card as IStripeCard;
    let success = false;
    const {firstName, lastName} = getFirstAndLastName(event.payerName);

    await callGuestCustomerEndpoint(firstName, lastName, event.payerEmail?? '').then(async (customerResult) => {
        if(customerResult.success) {
            const shippingAddress = event.shippingAddress as IStripeAddress;
            let shippingPhoneNumber = shippingAddress.phone;
            if(phoneNumberRequired && !shippingPhoneNumber) {
                shippingPhoneNumber = event.payerPhone;
            }
            const address = formatStripeShippingAddress(shippingAddress, shippingPhoneNumber);
            await updateShippingAddress(address, API_RETRY).then(async (shippingResult) => {
                if (shippingResult.success) {
                    const billingAddress = formatStripeBillingAddress(card, event.payerName, event.payerPhone);
                    await setBillingAddress(billingAddress, API_RETRY).then(async (billingResult) => {
                        if (billingResult.success) {
                            const payment: IAddPaymentRequest = {
                                token: token.id,
                                gateway_public_id: stripeGatewayId,
                                currency: card.currency,
                                amount: order_total
                            };
                            await addPayment(payment, API_RETRY).then(async (paymentResult) => {
                                if (paymentResult.success) {
                                    success = true;
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    if(success){
        event.complete && event.complete('success');
        orderProcessing();
    } else {
        event.complete && event.complete('fail');
    }

}
