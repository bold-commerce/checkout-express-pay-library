import {createPaymentGatewayOrder, ICreatePaymentGatewayOrderRequest, ICreatePaymentGatewayOrderResponse} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/types';
import {displayError} from 'src/actions';

export async function ppcpOrderCreate(): Promise<string> {
    const payment: ICreatePaymentGatewayOrderRequest = {
        gateway_type: 'paypal',
        payment_data: {
            locale: navigator.language,
            payment_type: 'paypal',
        }
    };

    const paymentResult = await createPaymentGatewayOrder(payment, API_RETRY);
    if(paymentResult.success) {
        const response = paymentResult.response as ICreatePaymentGatewayOrderResponse;
        const orderId = response.data.id as string;
        return orderId;
    } else {
        displayError('There was an unknown error while loading the payment.', 'payment_gateway', 'unknown_error');
        return '';
    }

}
