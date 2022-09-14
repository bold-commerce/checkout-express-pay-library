import {CreateOrderActions, CreateOrderData} from '@paypal/paypal-js/types/components/buttons';
import {CreateOrderRequestBody} from '@paypal/paypal-js/types/apis/orders';
import {getPaypalOrder} from 'src/paypal';

export async function paypalCreateOrder(data: CreateOrderData, actions: CreateOrderActions): Promise<string> {
    const paypalOrder: CreateOrderRequestBody = getPaypalOrder();
    return actions.order.create(paypalOrder);
}
