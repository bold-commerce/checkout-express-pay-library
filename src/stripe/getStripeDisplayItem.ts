import {getApplicationState, IDiscount, IFees, ITax} from '@bold-commerce/checkout-frontend-library';

export function getStripeDisplayItem(): Array<{label: string, amount: number}>{

    const {line_items, taxes, discounts, fees, shipping} = getApplicationState();
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
        {label: 'Shipping', amount: shipping.selected_shipping? shipping.selected_shipping.amount : 0 },
        {label: 'Fees', amount: totalFees}]
    );
}
