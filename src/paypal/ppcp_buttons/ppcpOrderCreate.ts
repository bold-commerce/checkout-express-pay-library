import {
    IApiSuccessResponse,
    IWalletPayCreateOrderRequest,
    IWalletPayCreateOrderResponse,
    walletPayCreateOrder
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/types';
import {displayError} from 'src/actions';

export async function ppcpOrderCreate(): Promise<string> {
    const payment: IWalletPayCreateOrderRequest = {
        gateway_type: 'paypal',
        payment_data: {
            locale: navigator.language,
            payment_type: 'paypal',
        }
    };

    const paymentResult = await walletPayCreateOrder(payment, API_RETRY);
    if(paymentResult.success) {
        const {data} = paymentResult.response as IApiSuccessResponse;
        const {payment_data} = data as IWalletPayCreateOrderResponse;
        const orderId = payment_data.id as string;
        return orderId;
    } else {
        displayError('There was an unknown error while loading the payment.', 'payment_gateway', 'unknown_error');
        return '';
    }

}
