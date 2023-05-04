import {changeShippingLine} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY, IStripeEvent, IStripeShippingOptions, getPaymentRequestDisplayItems, getTotals} from 'src';

export async function changeStripeShippingLines(event: IStripeEvent): Promise<void> {
    const shippingOption = event.shippingOption as IStripeShippingOptions;
    const response = await changeShippingLine(shippingOption.id, API_RETRY);
    const displayItems = getPaymentRequestDisplayItems();

    if(response.success){
        const {totalAmountDue} = getTotals();
        const total = {
            label: 'Total',
            amount: totalAmountDue
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
