import {getCurrency, getDiscounts, IDiscount} from '@bold-commerce/checkout-frontend-library';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getValueByCurrency} from 'src';

export function getPaypalDiscountTotal(): AmountWithCurrencyCode {
    const discounts = getDiscounts();
    const {iso_code: currencyCode} = getCurrency();

    const discountValue = discounts.reduce(((sum: number, item: IDiscount) => sum + item.value), 0);
    return {
        currency_code: currencyCode,
        value: getValueByCurrency(discountValue, currencyCode)
    };
}
