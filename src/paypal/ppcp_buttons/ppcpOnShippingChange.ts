import {OnShippingChangeActions, OnShippingChangeData} from '@paypal/paypal-js/types/components/buttons';
import {
    IWalletPayOnShippingRequest,
    walletPayOnShipping
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src';


export async function ppcpOnShippingChange(data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void> {

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
