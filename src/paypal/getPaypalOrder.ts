import {getPublicOrderId,} from '@bold-commerce/checkout-frontend-library';
import {CreateOrderRequestBody} from '@paypal/paypal-js/types/apis/orders';
import {getPaypalAmountWithBreakdown, getPaypalPurchaseItems} from 'src';

export function getPaypalOrder(): CreateOrderRequestBody {
    const publicOrderId = getPublicOrderId();

    return {
        purchase_units: [{
            custom_id: publicOrderId,
            amount: getPaypalAmountWithBreakdown(),
            items: getPaypalPurchaseItems()
        }]
    };
}
