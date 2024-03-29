import {getCurrency, getFees, getLineItems} from '@boldcommerce/checkout-frontend-library';
import {PurchaseItem} from '@paypal/paypal-js/types/apis/orders';
import {getValueByCurrency, paypalConstants} from 'src';

export function getPaypalPurchaseItems(): Array<PurchaseItem> {
    const {MAX_STRING_LENGTH: maxItemNameLength} = paypalConstants;
    const items = getLineItems();
    const fees = getFees();
    const {iso_code: currencyCode} = getCurrency();
    const purchaseItems: Array<PurchaseItem> = [];

    items.forEach(item => {
        const product = item.product_data;
        const qty = product.quantity.toString();
        const title = product.product_title.substring(0, maxItemNameLength - qty.length - 3);
        const description = `${product.title} - ${product.description}`;
        purchaseItems.push({
            name: `${title} x ${qty}`,
            description: description.substring(0, maxItemNameLength),
            sku: product.sku,
            quantity: qty,
            unit_amount: {currency_code: currencyCode, value: getValueByCurrency(product.price, currencyCode)},
            category: product.requires_shipping ? 'PHYSICAL_GOODS' : 'DIGITAL_GOODS',
        });
    });

    fees.forEach(fee => {
        purchaseItems.push({
            name: fee.line_text,
            description: '',
            quantity: '1',
            unit_amount: {currency_code: currencyCode, value: getValueByCurrency(fee.value, currencyCode)},
            category: 'DIGITAL_GOODS',
        });
    });

    return purchaseItems;
}
