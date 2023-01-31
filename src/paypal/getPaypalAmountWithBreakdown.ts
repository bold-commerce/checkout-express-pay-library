import {getCurrency} from '@bold-commerce/checkout-frontend-library';
import {AmountWithBreakdown} from '@paypal/paypal-js/types/apis/orders';
import {
    getPaypalDiscountTotal,
    getPaypalItemsTotal,
    getPaypalShippingDiscountTotal,
    getPaypalShippingTotal,
    getPaypalTaxTotal,
    getValueByCurrency,
    getTotals
} from 'src';

export function getPaypalAmountWithBreakdown(): AmountWithBreakdown {
    const totals = getTotals();
    const {iso_code: currencyCode} = getCurrency();

    const total = getValueByCurrency(totals.totalAmountDue, currencyCode);

    return {
        currency_code: currencyCode,
        value: total,
        breakdown: {
            item_total: getPaypalItemsTotal(),
            shipping: getPaypalShippingTotal(),
            tax_total: getPaypalTaxTotal(),
            discount: getPaypalDiscountTotal(),
            shipping_discount: getPaypalShippingDiscountTotal()
        }
    };
}
