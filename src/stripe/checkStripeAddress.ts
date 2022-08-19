import {formatStripeAddress} from 'src/stripe';
import {
    getApplicationState,
    getShipping,
    getShippingLines,
    setShippingAddress,
    setTaxes
} from '@bold-commerce/checkout-frontend-library';
import {API_RETRY, IStripeAddress, IStripeEvent, IStripePaymentItem} from 'src/types';

export async function checkStripeAddress(event: IStripeEvent): Promise<void> {
    let error = false;
    const shippingAddress = event.shippingAddress as IStripeAddress;
    const address = formatStripeAddress(shippingAddress);
    const response = await setShippingAddress(address, API_RETRY);

    if(response.success){
        const shippingLinesResponse = await getShippingLines(API_RETRY);
        const taxResponse = await setTaxes(API_RETRY);

        if(shippingLinesResponse.success && taxResponse.success){

            const {order_total} = getApplicationState();
            const {available_shipping_lines: shippingLines} = getShipping();
            if(shippingLines.length > 0) {
                const shippingOptions = shippingLines.map(p => ({id: p.id, label: p.description, amount: p.amount}));
                const total: IStripePaymentItem = {
                    label: 'Total',
                    amount: order_total,
                    pending: true,
                };

                event.updateWith({
                    total: total,
                    status: 'success',
                    shippingOptions: shippingOptions
                });
            } else {
                error = true;
            }
        } else {
            error = true;
        }
    } else {
        error = true;
    }

    if(error){
        event.updateWith({
            status:'invalid_shipping_address'
        });
    }

}
