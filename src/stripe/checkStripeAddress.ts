import {formatStripeShippingAddress, getPaymentRequestDisplayItems, API_RETRY, IStripeAddress, IStripeEvent, IStripePaymentItem} from 'src';
import {
    getApplicationState,
    getShipping,
    getShippingLines,
    setShippingAddress,
    setTaxes
} from '@bold-commerce/checkout-frontend-library';

export async function checkStripeAddress(event: IStripeEvent): Promise<void> {
    let error = false;
    const shippingAddress = event.shippingAddress as IStripeAddress;
    const address = formatStripeShippingAddress(shippingAddress);
    const response = await setShippingAddress(address, API_RETRY);

    if(response.success){
        const shippingLinesResponse = await getShippingLines(API_RETRY);
        const taxResponse = await setTaxes(API_RETRY);

        if(shippingLinesResponse.success && taxResponse.success){

            const {order_total} = getApplicationState();
            const displayItems = getPaymentRequestDisplayItems();
            const {available_shipping_lines: shippingLines} = getShipping();
            if(shippingLines.length > 0) {
                const shippingOptions = shippingLines.map(p => ({id: p.id, label: p.description, amount: p.amount}));
                const total: IStripePaymentItem = {
                    label: 'Total',
                    amount: order_total
                };

                event.updateWith({
                    total: total,
                    status: 'success',
                    shippingOptions: shippingOptions,
                    displayItems: displayItems
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
