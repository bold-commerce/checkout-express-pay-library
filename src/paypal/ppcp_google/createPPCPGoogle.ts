import {
    enableDisableSection, getPPCPGooglePayConfigChecked,
    getPPCPGooglePaySession,
    showPaymentMethodTypes,
    ppcpOnClickGoogle
} from 'src';

export function createPPCPGoogle(): void {

    const isMounted = !!document.getElementById('ppcp-apple-express-payment');
    const paymentsClient = getPPCPGooglePaySession();
    const {allowedPaymentMethods} = getPPCPGooglePayConfigChecked();

    if (!isMounted) {
        const ppcpGoogleDiv = document.createElement('div');
        ppcpGoogleDiv.id = 'ppcp-google-express-payment';
        ppcpGoogleDiv.className = 'ppcp-google-express-payment express-payment';
        ppcpGoogleDiv.dataset.testid = 'ppcp-google-express-payment';

        const button = paymentsClient?.createButton({
            onClick: ppcpOnClickGoogle,
            buttonType: 'short',
            buttonSizeMode: 'fill',
            allowedPaymentMethods: allowedPaymentMethods
        }) as HTMLButtonElement;

        button.className = 'ppcp-google-pay-button';
        button.id = 'ppcp-google-pay-button';
        button.dataset.testid = 'ppcp-google-pay-button';
        ppcpGoogleDiv.appendChild(button);

        const container = document.getElementById('express-payment-container');
        if (!container) {
            enableDisableSection( showPaymentMethodTypes.PPCP_GOOGLE, false);
            return;
        }
        container.appendChild(ppcpGoogleDiv);
    }
    enableDisableSection( showPaymentMethodTypes.PPCP_GOOGLE, true);
}
