import {getBraintreeApplePaySessionChecked} from 'src/braintree/manageBraintreeState';
import {
    API_RETRY,
    getPaymentRequestDisplayItems,
    getValueByCurrency,
} from 'src';
import {
    changeShippingLine,
    getApplicationState,
    getCurrency,
    getShipping,
    getShippingLines,
    setTaxes
} from '@bold-commerce/checkout-frontend-library';
import ApplePayLineItem = ApplePayJS.ApplePayLineItem;
import ApplePayShippingMethodSelectedEvent = ApplePayJS.ApplePayShippingMethodSelectedEvent;

export async function braintreeOnShippingMethodSelectedApple(event: ApplePayShippingMethodSelectedEvent): Promise<void> {
    const {iso_code: currencyCode} = getCurrency();
    const applePaySession = getBraintreeApplePaySessionChecked();
    const {available_shipping_lines: shippingLines} = getShipping();
    const selectedShippingMethod = event.shippingMethod;
    const option = shippingLines.find(line => line.id === selectedShippingMethod.identifier);

    if (option) {
        const response = await changeShippingLine(option.id, API_RETRY);

        if (response.success) {
            const shippingLinesResponse = await getShippingLines(API_RETRY);
            const taxResponse = await setTaxes(API_RETRY);

            if (shippingLinesResponse.success && taxResponse.success) {
                const {order_total} = getApplicationState();
                const displayItems = getPaymentRequestDisplayItems().map(
                    ({label, amount}) => ({
                        label,
                        amount: getValueByCurrency(amount, currencyCode),
                    }));

                applePaySession.completeShippingMethodSelection({
                    newLineItems: displayItems as Array<ApplePayLineItem>,
                    newTotal: {label: 'Total', amount: getValueByCurrency(order_total, currencyCode)},
                });
            }
        }
    }
}
