import {OnApproveData} from '@paypal/paypal-js/types/components/buttons';
import {
    getTotals,
} from 'src/utils';
import {
    addPayment,
    getCurrency,
    IAddPaymentRequest,
    IWalletPayOnApproveRequest,
    walletPayOnApprove,
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/types';
import {getPaypalGatewayPublicId} from 'src/paypal/managePaypalState';
import {orderProcessing, displayError} from 'src/actions';

export async function paypalOnApprove(data: OnApproveData): Promise<void> {
    const {iso_code: currencyCode} = getCurrency();

    const body: IWalletPayOnApproveRequest = {
        gateway_type: 'paypal',
        payment_data: {
            locale: navigator.language,
            paypal_order_id: data.orderID
        }
    };

    const res = await walletPayOnApprove(body, API_RETRY);

    if (!res.success) {
        displayError('There was an unknown error while processing your payment.', 'payment_gateway', 'unknown_error');
        return;
    }

    const totals = getTotals();
    const payment: IAddPaymentRequest = {
        token: `${data.orderID}:${data.payerID}`,
        nonce: `${data.orderID}:${data.payerID}`, // TODO: Temporarily required - It is not in the API documentation, but required for Paypal Express
        gateway_public_id: getPaypalGatewayPublicId(),
        currency: currencyCode,
        amount: totals.totalAmountDue,
        wallet_pay_type: 'paypal',
    } as IAddPaymentRequest;
    const paymentResult = await addPayment(payment, API_RETRY);
    if (!paymentResult.success) {
        displayError('There was an unknown error while processing your payment.', 'payment_gateway', 'unknown_error');
        return;
    }

    // finalize order
    orderProcessing();

}
