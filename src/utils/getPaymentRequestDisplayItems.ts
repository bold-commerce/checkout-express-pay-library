import {getApplicationState} from '@boldcommerce/checkout-frontend-library';
import {getTotals} from 'src/utils/getTotals';

export function getPaymentRequestDisplayItems(): Array<{ amount: number; label: string }> {
    const {line_items, shipping} = getApplicationState();
    const {totalTaxes, totalFees, totalDiscounts, totalPaid} = getTotals();
    const shippingAmount = shipping.selected_shipping ? shipping.selected_shipping.amount : 0;

    return line_items.map(item => ({
        amount: item.product_data.total_price,
        label: item.product_data.product_title
    })).concat([
        // Previous paid amounts are added to discounts since Payment gateways do not have an specific place for it, and is required for total amount consistency validation.
        {label: 'Discounts', amount: totalDiscounts + totalPaid},
        {label: 'Taxes', amount: totalTaxes},
        {label: 'Shipping', amount: shippingAmount},
        {label: 'Fees', amount: totalFees}]
    );
}
