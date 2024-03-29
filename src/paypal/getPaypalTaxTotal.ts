import {getCurrency, getTaxes, ITax} from '@boldcommerce/checkout-frontend-library';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getValueByCurrency} from 'src';

export function getPaypalTaxTotal(): AmountWithCurrencyCode {
    const taxes = getTaxes();
    const {iso_code: currencyCode} = getCurrency();

    const taxValue = taxes.reduce(((sum: number, item: ITax) => sum + (item.is_included ? 0 : item.value)), 0);
    return {
        currency_code: currencyCode,
        value: getValueByCurrency(taxValue, currencyCode)
    };
}
