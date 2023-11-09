import {braintreeOnClickApple, enableDisableSection, showPaymentMethodTypes} from 'src';

export function createBraintreeApple(): void {

    const isMounted = !!document.getElementById('braintree-apple-express-payment');

    if (!isMounted) {
        // creating a braintree-apple payment div inside express payment container
        const braintreeDiv = document.createElement('div');
        braintreeDiv.id = 'braintree-apple-express-payment';
        braintreeDiv.className = 'braintree-apple-express-payment express-payment';

        const button = document.createElement('button');
        button.className = 'braintree-apple-pay-button';
        button.id = 'braintree-apple-pay-button';
        button.type = 'button';
        button.addEventListener('click', braintreeOnClickApple);
        braintreeDiv.appendChild(button);

        const container = document.getElementById('express-payment-container');
        if (!container) {
            enableDisableSection( showPaymentMethodTypes.BRAINTREE_APPLE, false);
            return;
        }
        container.appendChild(braintreeDiv);
    }
    enableDisableSection( showPaymentMethodTypes.BRAINTREE_APPLE, true);
}
