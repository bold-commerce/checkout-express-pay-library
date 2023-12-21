import {
    formatStripeShippingAddress,
    getPaymentRequestDisplayItems,
    API_RETRY,
    IStripeAddress,
    IStripeEvent,
    IStripePaymentItem,
    getPhoneNumber,
    getTotals
} from 'src';
import {
    changeShippingLine,
    estimateShippingLines,
    estimateTaxes,
    getOrderInitialData,
    getShipping,
    getShippingLines,
    setShippingAddress,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';

export async function checkStripeAddress(event: IStripeEvent): Promise<void> {
    let error = false;
    const shippingAddress = event.shippingAddress as IStripeAddress;
    const address = formatStripeShippingAddress(shippingAddress, getPhoneNumber(shippingAddress.phone));
    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;

    let shippingLinesResponse;
    let successResponse = false;
    if (rsaEnabled) {
        shippingLinesResponse = await estimateShippingLines(address, API_RETRY);
    } else {
        const response = await setShippingAddress(address, API_RETRY);
        if (response.success) {
            shippingLinesResponse = await getShippingLines(API_RETRY);
        }
    }

    if (shippingLinesResponse && shippingLinesResponse.success) {
        const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
        if (!selectedShipping && shippingLines.length > 0) {
            await changeShippingLine(shippingLines[0].id, API_RETRY);
        }
        await getShippingLines(API_RETRY);
    }

    if (rsaEnabled) {
        if (shippingLinesResponse && shippingLinesResponse.success) {
            const taxResponse = await estimateTaxes(address, API_RETRY);
            if (taxResponse.success) {
                successResponse = true;
            }
        }
    } else {
        if (shippingLinesResponse && shippingLinesResponse.success) {
            const taxResponse = await setTaxes(API_RETRY);
            if (taxResponse.success) {
                successResponse = true;
            }
        }
    }


    if (successResponse) {
        const {totalAmountDue} = getTotals();
        const displayItems = getPaymentRequestDisplayItems();
        const {available_shipping_lines: shippingLines} = getShipping();
        if(shippingLines.length > 0) {
            const shippingOptions = shippingLines.map(p => ({id: p.id, label: p.description, amount: p.amount}));
            const total: IStripePaymentItem = {
                label: 'Total',
                amount: totalAmountDue
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

    if(error){
        event.updateWith({
            status:'invalid_shipping_address'
        });
    }

}
