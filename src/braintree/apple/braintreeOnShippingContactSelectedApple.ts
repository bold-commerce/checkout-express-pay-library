import {getBraintreeApplePaySessionChecked} from 'src/braintree/manageBraintreeState';
import ApplePayShippingContactSelectedEvent = ApplePayJS.ApplePayShippingContactSelectedEvent;
import {
    API_RETRY,
    callShippingAddressEndpoint,
    formatBraintreeShippingAddressApple,
    getPaymentRequestDisplayItems,
    getValueByCurrency,
} from 'src';
import {
    getApplicationState,
    getCurrency,
    getShipping,
    getShippingLines,
    setTaxes
} from '@bold-commerce/checkout-frontend-library';

export async function braintreeOnShippingContactSelectedApple(event: ApplePayShippingContactSelectedEvent): Promise<void> {
    const {iso_code: currencyCode} = getCurrency();
    const applePaySession = getBraintreeApplePaySessionChecked();
    const shippingAddress = event.shippingContact;
    const address = formatBraintreeShippingAddressApple(shippingAddress);

    const fail = () => {
        const {order_total} = getApplicationState();
        applePaySession.completeShippingContactSelection({
            errors: [new ApplePayError('shippingContactInvalid')],
            newTotal: {label: 'Total', amount: getValueByCurrency(order_total, currencyCode)},
        });
    };

    const response = await callShippingAddressEndpoint(address, true);

    if(response.success){
        const shippingLinesResponse = await getShippingLines(API_RETRY);
        const taxResponse = await setTaxes(API_RETRY);

        if(shippingLinesResponse.success && taxResponse.success){
            const {order_total} = getApplicationState();
            const displayItems = getPaymentRequestDisplayItems().map(
                ({label, amount}) => ({
                    label,
                    amount: getValueByCurrency(amount, currencyCode),
                }));
            const {available_shipping_lines: shippingLines} = getShipping();

            const shippingOptions = shippingLines.map(p => ({
                label: p.description,
                detail: '',
                amount: getValueByCurrency(p.amount, currencyCode),
                identifier: p.id
            }));

            applePaySession.completeShippingContactSelection({
                newLineItems: displayItems,
                newShippingMethods: shippingOptions,
                newTotal: {label: 'Total', amount: getValueByCurrency(order_total, currencyCode)},
            });

        } else {
            fail();
        }
    } else {
        fail();
    }
}
