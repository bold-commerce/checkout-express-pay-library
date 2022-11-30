import {getApplicationState, IDiscount, IFees, ITax} from '@bold-commerce/checkout-frontend-library';

export function getPaymentRequestDisplayItems(): Array<{ amount: number; label: string }> {
    const {line_items, taxes, discounts, fees, shipping} = getApplicationState();
    const shippingAmount = shipping.selected_shipping ? shipping.selected_shipping.amount : 0;
    let totalTaxes = 0, totalFees = 0, totalDiscounts = 0;

    taxes.map((item: ITax) => {
        totalTaxes += item.value;
    });

    discounts.map((item: IDiscount) => {
        totalDiscounts += item.value;
    });

    fees && fees.map((item: IFees) => {
        totalFees += item.value;
    });

    return line_items.map(item => ({
        amount: item.product_data.total_price,
        label: item.product_data.product_title
    })).concat([
        {label: 'Discounts', amount: totalDiscounts},
        {label: 'Taxes', amount: totalTaxes},
        {label: 'Shipping', amount: shippingAmount},
        {label: 'Fees', amount: totalFees}]
    );
}
