import {
    braintreeCreatePaymentRequestGoogle,
    displayError,
    getBraintreeGooglePayClientChecked,
} from 'src';

export async function braintreeOnClickGoogle(): Promise<void> {
    const googlePayClient = getBraintreeGooglePayClientChecked();
    const paymentDataRequest = braintreeCreatePaymentRequestGoogle();

    try {
        await googlePayClient.loadPaymentData(paymentDataRequest);
    } catch (e) {
        displayError('There was an unknown error while loading the wallet pay', 'generic', 'unknown_error');
        return;
    }
}
