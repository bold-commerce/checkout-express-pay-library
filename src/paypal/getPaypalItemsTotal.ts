import {getCurrency, getLineItems, ILineItem} from '@bold-commerce/checkout-frontend-library';
import {AmountWithCurrencyCode} from '@paypal/paypal-js';
import {getValueByCurrency} from 'src';

export function getPaypalItemsTotal(): AmountWithCurrencyCode {
    const items = getLineItems();
    const {iso_code: currencyCode} = getCurrency();

    const itemValue = items.reduce(((sum: number, item: ILineItem) => sum + item.product_data.total_price), 0);
    return {
        currency_code: currencyCode,
        value: getValueByCurrency(itemValue, currencyCode)
    };
}
