import {getBraintreeApplePaySessionChecked} from 'src/braintree/manageBraintreeState';
import ApplePayShippingContactSelectedEvent = ApplePayJS.ApplePayShippingContactSelectedEvent;
import {
    API_RETRY,
    callShippingAddressEndpoint,
    formatApplePayContactToCheckoutAddress,
    getPaymentRequestDisplayItems,
    getTotals,
    getValueByCurrency,
} from 'src';
import {
    getCurrency,
    getShipping,
    getShippingLines,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';

export async function braintreeOnShippingContactSelectedApple(event: ApplePayShippingContactSelectedEvent): Promise<void> {
    const {iso_code: currencyCode} = getCurrency();
    const applePaySession = getBraintreeApplePaySessionChecked();
    const shippingAddress = event.shippingContact;
    const address = formatApplePayContactToCheckoutAddress(shippingAddress, true);

    const fail = () => {
        const {totalAmountDue} = getTotals();
        applePaySession.completeShippingContactSelection({
            errors: [new ApplePayError('shippingContactInvalid')],
            newTotal: {label: 'Total', amount: getValueByCurrency(totalAmountDue, currencyCode)},
        });
    };

    const response = await callShippingAddressEndpoint(address, true);

    if(response.success){
        const shippingLinesResponse = await getShippingLines(API_RETRY);
        const taxResponse = await setTaxes(API_RETRY);

        if(shippingLinesResponse.success && taxResponse.success){
            const {totalAmountDue} = getTotals();
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
                newTotal: {label: 'Total', amount: getValueByCurrency(totalAmountDue, currencyCode)},
            });

        } else {
            fail();
        }
    } else {
        fail();
    }
}
