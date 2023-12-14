import {IExpressPayPaypalCommercePlatformButton} from '@boldcommerce/checkout-frontend-library';
import {
    enableDisableSection,
    getPaypalNameSpace,
    paypalOnClick,
    ppcpOnApprove,
    showPaymentMethodTypes
} from 'src';
import {ppcpOrderCreate} from 'src/paypal/ppcp_buttons/ppcpOrderCreate';
import {ppcpOnShippingChange} from 'src/paypal/ppcp_buttons/ppcpOnShippingChange';

export async function ppcpOnLoad(payment: IExpressPayPaypalCommercePlatformButton): Promise<void> {

    const paypal = getPaypalNameSpace();

    let enableSection = false;

    const paypalButtonDiv = document.createElement('div');
    const paypalButtonDivId = 'ppcp-paypal-express-payment-button';
    paypalButtonDiv.id = paypalButtonDivId;
    paypalButtonDiv.dataset.testid = paypalButtonDivId;

    const payLaterButtonDiv = document.createElement('div');
    const payLaterButtonDivId = 'ppcp-paylater-express-payment-button';
    payLaterButtonDiv.id = payLaterButtonDivId;
    payLaterButtonDiv.dataset.testid = payLaterButtonDivId;

    // creating a paypal payment div inside express payment container
    const paypalDiv = document.createElement('div');
    const paypalDivId = 'ppcp-express-payment';
    paypalDiv.id = paypalDivId;
    paypalDiv.className = `${paypalDivId}`;
    paypalDiv.appendChild(paypalButtonDiv);
    paypalDiv.appendChild(payLaterButtonDiv);
    const container = document.getElementById('express-payment-container');
    container?.appendChild(paypalDiv);

    if (paypal?.Buttons) {
        const paypalButton = paypal.Buttons({
            fundingSource: 'paypal',
            createOrder: ppcpOrderCreate,
            onClick: paypalOnClick,
            onShippingChange: ppcpOnShippingChange,
            onApprove: ppcpOnApprove,
            style: {
                ...payment.style,
            },
        });

        const payLaterButton = paypal.Buttons({
            fundingSource: 'paylater',
            createOrder: ppcpOrderCreate,
            onClick: paypalOnClick,
            onShippingChange: ppcpOnShippingChange,
            onApprove: ppcpOnApprove,
            style: {
                ...payment.style,
            },
        });

        if(container) {
            if (paypalButton.isEligible()) {
                await paypalButton.render(`#${paypalButtonDivId}`);
                enableSection = true;
            }

            if (payLaterButton.isEligible()) {
                await payLaterButton.render(`#${payLaterButtonDivId}`);
                enableSection = true;
            }

        }

        if(enableSection) {
            enableDisableSection(showPaymentMethodTypes.PPCP, true);
        } else {
            paypalDiv.style.display = 'none';
        }
    }
}
