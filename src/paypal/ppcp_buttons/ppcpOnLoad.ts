import {IExpressPayPaypalCommercePlatformButton} from '@boldcommerce/checkout-frontend-library';
import {
    enableDisableSection,
    getPaypalNameSpace,
    paypalOnClick,
    paypalOnShippingChange,
    ppcpOnApprove,
    showPaymentMethodTypes
} from 'src';
import {OnShippingChangeActions, OnShippingChangeData} from '@paypal/paypal-js/types/components/buttons';
import {ppcpOrderCreate} from 'src/paypal/ppcp_buttons/ppcpOrderCreate';

export async function ppcpOnLoad(payment: IExpressPayPaypalCommercePlatformButton): Promise<void> {

    const paypal = getPaypalNameSpace();

    let enableSection = false;

    // creating a paypal payment div inside express payment container
    const paypalDiv = document.createElement('div');
    const paypalDivId = 'ppcp-express-payment';
    paypalDiv.id = paypalDivId;
    paypalDiv.className = `${paypalDivId}`;
    const container = document.getElementById('express-payment-container');
    container?.appendChild(paypalDiv);

    if (paypal?.Buttons) {
        const paypalButton = paypal.Buttons({
            fundingSource: 'paypal',
            createOrder: ppcpOrderCreate,
            onClick: paypalOnClick,
            onShippingChange: paypalOnShippingChange as (data: OnShippingChangeData, actions: OnShippingChangeActions) => Promise<void>,
            onApprove: ppcpOnApprove,
            style: {
                ...payment.style,
            },
        });

        const payLaterButton = paypal.Buttons({
            fundingSource: 'paylater',
            createOrder: ppcpOrderCreate,
            onClick: paypalOnClick,
            onShippingChange: paypalOnShippingChange as (data: OnShippingChangeData, actions: OnShippingChangeActions) => Promise<void>,
            onApprove: ppcpOnApprove,
            style: {
                ...payment.style,
            },
        });

        const venmoButton = paypal.Buttons({
            fundingSource: 'venmo',
            createOrder: ppcpOrderCreate,
            onClick: paypalOnClick,
            onApprove: ppcpOnApprove,
            style: {
                ...payment.style,
                color: 'blue', // paypal bug. venmo doesnt work with any other color
            },
        });

        if(container) {
            if (paypalButton.isEligible()) {
                await paypalButton.render(`#${paypalDivId}`);
                enableSection = true;
            }

            if (payLaterButton.isEligible()) {
                await payLaterButton.render(`#${paypalDivId}`);
                enableSection = true;
            }

            if (venmoButton.isEligible()) {
                await venmoButton.render(`#${paypalDivId}`);
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
