import {changeShippingLine, getApplicationState} from '@bold-commerce/checkout-frontend-library';
import {API_RETRY, IStripeEvent, IStripeShippingOptions} from 'src/types';


export async function changeStripeShippingLines(event: IStripeEvent): Promise<void> {
    const shippingOption = event.shippingOption as IStripeShippingOptions;
    const response = await changeShippingLine(shippingOption.id, API_RETRY);

    if(response.success){
        const {order_total} = getApplicationState();
        const total = {
            label: 'Total',
            amount: order_total,
            pending: true,
        };

        event.updateWith({
            total: total,
            status: 'success',
        });
    } else {
        event.updateWith({
            status:'fail'
        });
    }

}
