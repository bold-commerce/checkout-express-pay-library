import {getCurrency, getShipping, getTaxes, ITax} from '@bold-commerce/checkout-frontend-library';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getValueByCurrency} from 'src';

export function getPaypalTaxTotal(): AmountWithCurrencyCode {
    const taxes = getTaxes();
    const {taxes: shippingTaxes} = getShipping();
    const {iso_code: currencyCode} = getCurrency();

    const taxValue = taxes.reduce(((sum: number, item: ITax) => sum + item.value), 0);
    const shippingTaxesValue = shippingTaxes.reduce(((sum: number, item: ITax) => sum + item.value), 0);
    return {
        currency_code: currencyCode,
        value: getValueByCurrency(taxValue + shippingTaxesValue, currencyCode)
    };
}
