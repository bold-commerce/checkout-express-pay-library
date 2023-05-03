import {
    API_RETRY,
    getPaymentRequestDisplayItems,
    getPPCPApplePaySessionChecked,
    getTotals,
    getValueByCurrency,
} from 'src';
import {
    changeShippingLine,
    getCurrency,
    getShipping,
    getShippingLines,
    setTaxes
} from '@bold-commerce/checkout-frontend-library';
import ApplePayLineItem = ApplePayJS.ApplePayLineItem;
import ApplePayShippingMethodSelectedEvent = ApplePayJS.ApplePayShippingMethodSelectedEvent;

export async function ppcpOnShippingMethodSelectedApple(event: ApplePayShippingMethodSelectedEvent): Promise<void> {
    const {iso_code: currencyCode} = getCurrency();
    const applePaySession = getPPCPApplePaySessionChecked();
    const {available_shipping_lines: shippingLines} = getShipping();
    const selectedShippingMethod = event.shippingMethod;
    const option = shippingLines.find(line => line.id === selectedShippingMethod.identifier);

    if (option) {
        const response = await changeShippingLine(option.id, API_RETRY);

        if (response.success) {
            const shippingLinesResponse = await getShippingLines(API_RETRY);
            const taxResponse = await setTaxes(API_RETRY);

            if (shippingLinesResponse.success && taxResponse.success) {
                const {totalAmountDue} = getTotals();
                const displayItems: Array<ApplePayLineItem> = getPaymentRequestDisplayItems().map(
                    ({label, amount}) => ({
                        label,
                        amount: getValueByCurrency(amount, currencyCode),
                    }));

                applePaySession.completeShippingMethodSelection({
                    newLineItems: displayItems,
                    newTotal: {label: 'Total', amount: getValueByCurrency(totalAmountDue, currencyCode)},
                });
            }
        }
    }
}
