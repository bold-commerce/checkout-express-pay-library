import {OnShippingChangeActions, OnShippingChangeData} from '@paypal/paypal-js/types/components/buttons';
import {API_RETRY,} from 'src';
import {
    IWalletPayOnShippingRequest,
    walletPayOnShipping,
} from '@boldcommerce/checkout-frontend-library';
import {OrderResponseBody} from '@paypal/paypal-js/types/apis/orders';

export async function paypalOnShippingChange(data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void|OrderResponseBody> {
    const body: IWalletPayOnShippingRequest = {
        gateway_type: 'paypal',
        payment_data: {
            locale: navigator.language,
            paypal_order_id: data.orderID,
            shipping_address: data.shipping_address,
            shipping_options: data.selected_shipping_option,
        }
    };

    const res = await walletPayOnShipping(body, API_RETRY);
    if (!res.success) {
        return actions.reject();
    }
}
