import {
    changeShippingLine,
    estimateTaxes,
    getOrderInitialData,
    getShippingAddress,
    getShippingLines,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY, IStripeEvent, IStripeShippingOptions, getPaymentRequestDisplayItems, getTotals} from 'src';

export async function changeStripeShippingLines(event: IStripeEvent): Promise<void> {
    const shippingOption = event.shippingOption as IStripeShippingOptions;
    const response = await changeShippingLine(shippingOption.id, API_RETRY);
    const displayItems = getPaymentRequestDisplayItems();
    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;
    const address = getShippingAddress();

    if (response.success) {
        const shippingLinesResponse = await getShippingLines(API_RETRY);
        let taxResponse;
        if (rsaEnabled) {
            taxResponse = await estimateTaxes(address, API_RETRY);
        } else {
            taxResponse = await setTaxes(API_RETRY);
        }

        if (shippingLinesResponse.success && taxResponse.success) {
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
    } else {
        event.updateWith({
            status:'fail'
        });
    }

}
