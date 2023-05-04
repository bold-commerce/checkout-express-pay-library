import {getCurrency} from '@boldcommerce/checkout-frontend-library';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getTotals, getValueByCurrency} from 'src';

export function getPaypalDiscountTotal(): AmountWithCurrencyCode {
    const totals = getTotals();
    const {iso_code: currencyCode} = getCurrency();

    // Previous paid amounts are added to discounts since Payment gateways do not have an specific place for it, and is required for total amount consistency validation.
    const discountValue = totals.totalDiscounts + totals.totalPaid;
    return {
        currency_code: currencyCode,
        value: getValueByCurrency(discountValue, currencyCode)
    };
}
