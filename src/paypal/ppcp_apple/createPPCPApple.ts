import {enableDisableSection, showPaymentMethodTypes} from 'src';

export function createPPCPApple(): void {

    const isMounted = !!document.getElementById('ppcp-apple-express-payment');

    if (!isMounted) {
        // creating a paypal-apple payment div inside express payment container
        const ppcpAppleDiv = document.createElement('div');
        ppcpAppleDiv.id = 'ppcp-apple-express-payment';
        ppcpAppleDiv.className = 'ppcp-apple-express-payment';

        const button = document.createElement('button');
        button.className = 'ppcp-apple-pay-button';
        button.id = 'ppcp-apple-pay-button';
        button.addEventListener('click', () => {/*todo on-CLick PPCP Action and Add e.preventDefault() in it*/});
        ppcpAppleDiv.appendChild(button);

        const container = document.getElementById('express-payment-container');
        if (!container) {
            enableDisableSection( showPaymentMethodTypes.PPCP_APPLE, false);
            return;
        }
        container.appendChild(ppcpAppleDiv);
    }
    enableDisableSection( showPaymentMethodTypes.PPCP_APPLE, true);
}