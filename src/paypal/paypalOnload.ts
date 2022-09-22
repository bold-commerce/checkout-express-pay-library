import {alternatePaymentMethodType, IExpressPayPaypal} from '@bold-commerce/checkout-frontend-library';
import {
    getPaypalNameSpace,
    setPaypalButton,
    paypalCreateOrder,
    paypalOnApprove,
    paypalOnClick,
    paypalOnShippingChange,
} from 'src/paypal';
import {enableDisableSection} from 'src/actions';
import {OnShippingChangeActions, OnShippingChangeData} from '@paypal/paypal-js/types/components/buttons';

export async function paypalOnload(payment: IExpressPayPaypal): Promise<void> {
    const paypal = getPaypalNameSpace();
    const paypalDivId = 'paypal-express-payment';

    if (paypal?.Buttons) {
        const button = paypal.Buttons({
            createOrder: paypalCreateOrder,
            onClick: paypalOnClick,
            onShippingChange: paypalOnShippingChange as (data: OnShippingChangeData, actions: OnShippingChangeActions) => Promise<void>,
            onApprove: paypalOnApprove,
            style: {
                ...payment.button_style,
                height: 39
            }
        });

        setPaypalButton(button); // TODO - Check if we will still need to use the button on a later moment

        // creating a paypal payment div inside express payment container
        const paypalDiv = document.createElement('div');
        paypalDiv.id = paypalDivId;
        paypalDiv.className = `${paypalDivId} express-payment`;
        const container = document.getElementById('express-payment-container');
        container?.appendChild(paypalDiv);

        if (container && button.isEligible()) {
            await button.render(`#${paypalDivId}`);
            enableDisableSection( alternatePaymentMethodType.PAYPAL, true);
        } else {
            paypalDiv.style.display = 'none';
        }
    }
}
