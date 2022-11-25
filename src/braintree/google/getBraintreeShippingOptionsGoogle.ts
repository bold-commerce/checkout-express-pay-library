import {getValueByCurrency} from 'src';
import {getCurrency, getShipping} from '@bold-commerce/checkout-frontend-library';
import ShippingOptionParameters = google.payments.api.ShippingOptionParameters;
import SelectionOption = google.payments.api.SelectionOption;

export function getBraintreeShippingOptionsGoogle(): ShippingOptionParameters | undefined {
    const {iso_code: currencyCode} = getCurrency();
    const {available_shipping_lines: shippingLines, selected_shipping: selectedShipping} = getShipping();
    const defaultSelectedOptionId = selectedShipping?.id;

    if (!shippingLines || (Array.isArray(shippingLines) && shippingLines.length < 1)) {
        return;
    }

    const shippingOptions = shippingLines.map(p => ({
        id: p.id,
        label: `${getValueByCurrency(p.amount, currencyCode)}: ${p.description} `,
        description: ''
    })) as Array<SelectionOption>;

    return {
        shippingOptions,
        defaultSelectedOptionId
    };
}
