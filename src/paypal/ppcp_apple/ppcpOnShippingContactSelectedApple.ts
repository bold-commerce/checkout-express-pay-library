import ApplePayShippingContactSelectedEvent = ApplePayJS.ApplePayShippingContactSelectedEvent;
import {
    API_RETRY,
    callShippingAddressEndpoint,
    formatApplePayContactToCheckoutAddress,
    getPaymentRequestDisplayItems,
    getPPCPApplePaySessionChecked,
    getTotals,
    getValueByCurrency,
} from 'src';
import {
    getCurrency,
    getShipping,
    getShippingLines,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';

export async function ppcpOnShippingContactSelectedApple(event: ApplePayShippingContactSelectedEvent): Promise<void> {
    const {iso_code: currencyCode} = getCurrency();
    const applePaySession = getPPCPApplePaySessionChecked();
    const address = formatApplePayContactToCheckoutAddress(event.shippingContact);
    address.first_name = address.first_name.trim() || 'fistName';
    address.last_name = address.last_name.trim() || 'lastName';
    address.address_line_1 = address.address_line_1.trim() || 'addressLine1';


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

            const shippingOptions = shippingLines.map(line => ({
                label: line.description,
                detail: '',
                amount: getValueByCurrency(line.amount, currencyCode),
                identifier: line.id
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
