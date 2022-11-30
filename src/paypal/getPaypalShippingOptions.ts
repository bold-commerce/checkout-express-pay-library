import {getCurrency, getShipping} from '@bold-commerce/checkout-frontend-library';
import {ShippingInfoOption} from '@paypal/paypal-js/types/apis/orders';
import {getValueByCurrency, paypalConstants} from 'src';

export function getPaypalShippingOptions(): Array<ShippingInfoOption> {
    const {MAX_STRING_LENGTH: maxStringSize, MAX_SHIPPING_OPTIONS_LENGTH: maxOptions} = paypalConstants;
    const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
    const {iso_code: currencyCode} = getCurrency();
    const options: Array<ShippingInfoOption> = [];
    const filteredShippingLines = shippingLines.filter(line => line.id !== selectedShipping.id);
    if (selectedShipping) {
        options.push({
            id: selectedShipping.id.substring(0, maxStringSize),
            label: selectedShipping.description.substring(0, maxStringSize),
            amount: {
                currency_code: currencyCode,
                value: getValueByCurrency(selectedShipping.amount, currencyCode)
            },
            type: 'SHIPPING',
            selected: true
        });
    }
    filteredShippingLines.forEach(line => {
        options.push({
            id: line.id.substring(0, maxStringSize),
            label: line.description.substring(0, maxStringSize),
            amount: {
                currency_code: currencyCode,
                value: getValueByCurrency(line.amount, currencyCode)
            },
            type: 'SHIPPING',
            selected: false
        });
    });

    return options.slice(0, maxOptions);
}
