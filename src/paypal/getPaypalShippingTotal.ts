import {getCurrency, getShipping} from '@bold-commerce/checkout-frontend-library';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getValueByCurrency} from 'src';

export function getPaypalShippingTotal(): AmountWithCurrencyCode {
    const {selected_shipping: selectedShipping} = getShipping();
    const {iso_code: currencyCode} = getCurrency();

    return {
        currency_code: currencyCode,
        value: getValueByCurrency(selectedShipping.amount, currencyCode)
    };
}
