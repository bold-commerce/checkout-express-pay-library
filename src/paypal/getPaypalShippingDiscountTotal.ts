import {getCurrency, getShipping, IDiscount} from '@boldcommerce/checkout-frontend-library';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getValueByCurrency} from 'src';

export function getPaypalShippingDiscountTotal(): AmountWithCurrencyCode {
    const {discounts: shippingDiscounts} = getShipping();
    const {iso_code: currencyCode} = getCurrency();

    const shippingDiscountValue = shippingDiscounts.reduce(((sum: number, item: IDiscount) => sum + item.value), 0);
    return {
        currency_code: currencyCode,
        value: getValueByCurrency(shippingDiscountValue, currencyCode)
    };
}
