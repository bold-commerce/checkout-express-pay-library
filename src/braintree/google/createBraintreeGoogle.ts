import {
    braintreeConstants,
    braintreeCreatePaymentRequestGoogle,
    braintreeOnClickGoogle,
    enableDisableSection,
    getBraintreeGooglePayClientChecked,
    getBraintreeGooglePayInstanceChecked,
    showPaymentMethodTypes
} from 'src';

export async function createBraintreeGoogle(): Promise<void> {
    const googlePayClient = getBraintreeGooglePayClientChecked();
    const googlePayInstance = getBraintreeGooglePayInstanceChecked();
    const container = document.getElementById('braintree-google-express-payment');
    const allowedPaymentMethods = googlePayInstance.createPaymentDataRequest().allowedPaymentMethods.filter(m => m.type === 'CARD');

    const isReadyToPay = await googlePayClient.isReadyToPay({
        apiVersion: braintreeConstants.GOOGLEPAY_VERSION_NUMBER,
        apiVersionMinor: braintreeConstants.GOOGLEPAY_VERSION_NUMBER_MINOR,
        allowedPaymentMethods: allowedPaymentMethods,
    });

    if (isReadyToPay.result) {
        if (!container) {
            // creating a braintree-google payment div inside express payment container
            const braintreeDiv = document.createElement('div');
            braintreeDiv.id = 'braintree-google-express-payment';
            braintreeDiv.className = 'braintree-google-express-payment express-payment';

            const button = googlePayClient.createButton({
                onClick: braintreeOnClickGoogle,
                buttonType: 'short',
                buttonSizeMode: 'fill',
                allowedPaymentMethods
            }) as HTMLButtonElement;
            button.className = 'braintree-google-pay-button';
            button.id = 'braintree-google-pay-button';
            braintreeDiv.appendChild(button);

            const expressContainer = document.getElementById('express-payment-container');
            if (!expressContainer) {
                enableDisableSection( showPaymentMethodTypes.BRAINTREE_GOOGLE, false);
                return;
            }
            expressContainer.appendChild(braintreeDiv);
        }

        const paymentDataRequest = braintreeCreatePaymentRequestGoogle();
        googlePayClient.prefetchPaymentData(paymentDataRequest);

        enableDisableSection( showPaymentMethodTypes.BRAINTREE_GOOGLE, true);
    } else {
        enableDisableSection( showPaymentMethodTypes.BRAINTREE_GOOGLE, false);
        if (container) {
            container.style.display = 'none';
        }
    }
}
