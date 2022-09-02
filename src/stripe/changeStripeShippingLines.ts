import {changeShippingLine, getApplicationState} from '@bold-commerce/checkout-frontend-library';
import {API_RETRY, IStripeEvent, IStripeShippingOptions, getStripeDisplayItem} from 'src';


export async function changeStripeShippingLines(event: IStripeEvent): Promise<void> {
    const shippingOption = event.shippingOption as IStripeShippingOptions;
    const response = await changeShippingLine(shippingOption.id, API_RETRY);
    const displayItems = getStripeDisplayItem();

    if(response.success){
        const {order_total} = getApplicationState();
        const total = {
            label: 'Total',
            amount: order_total
        };

        event.updateWith({
            total: total,
            status: 'success',
            displayItems: displayItems
        });
    } else {
        event.updateWith({
            status:'fail'
        });
    }

}
