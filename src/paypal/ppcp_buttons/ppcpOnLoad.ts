import {IExpressPayPaypalCommercePlatform} from '@boldcommerce/checkout-frontend-library';
import {
    enableDisableSection,
    getPaypalNameSpace,
    paypalCreateOrder,
    paypalOnClick,
    paypalOnShippingChange,
} from 'src';
import {OnShippingChangeActions, OnShippingChangeData} from '@paypal/paypal-js/types/components/buttons';
import {ppcpOnApprove} from 'src/paypal/ppcp_buttons/ppcpOnApprove';

export async function ppcpOnLoad(payment: IExpressPayPaypalCommercePlatform) {

    const paypal = getPaypalNameSpace();

    if (paypal?.Buttons) {
        const button = paypal.Buttons({
            createOrder: paypalCreateOrder,
            onClick: paypalOnClick,
            onShippingChange: paypalOnShippingChange as (data: OnShippingChangeData, actions: OnShippingChangeActions) => Promise<void>,
            onApprove: ppcpOnApprove,
            style: {
                //...payment.button_style,
                height: 39
            },
        });

        // creating a paypal payment div inside express payment container
        const paypalDiv = document.createElement('div');
        const paypalDivId = 'paypal-express-payment';
        paypalDiv.id = paypalDivId;
        paypalDiv.className = `${paypalDivId} express-payment`;
        const container = document.getElementById('express-payment-container');
        container?.appendChild(paypalDiv);

        if (container && button.isEligible()) {
            await button.render(`#${paypalDivId}`);
            enableDisableSection('paypalCommercePlatform', true);
        } else {
            paypalDiv.style.display = 'none';
        }
    }
}
