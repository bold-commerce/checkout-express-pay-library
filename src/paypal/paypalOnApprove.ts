import {OnApproveActions, OnApproveData} from '@paypal/paypal-js/types/components/buttons';
import {OrderResponseBody, ShippingInfo} from '@paypal/paypal-js/types/apis/orders';
import {
    callBillingAddressEndpoint,
    callGuestCustomerEndpoint,
    callShippingAddressEndpoint,
    getFirstAndLastName,
    isObjectEquals
} from 'src/utils';
import {formatPaypalToApiAddress} from 'src/paypal/formatPaypalToApiAddress';
import {
    addPayment,
    getApplicationState,
    getCurrency,
    IAddPaymentRequest,
    setTaxes,
} from '@bold-commerce/checkout-frontend-library';
import {API_RETRY} from 'src/types';
import {getPaypalGatewayPublicId} from 'src/paypal/managePaypalState';
import {orderProcessing} from 'src/actions';

export async function paypalOnApprove(data: OnApproveData, actions: OnApproveActions): Promise<void> {
    const {iso_code: currencyCode} = getCurrency();
    return actions.order?.get().then(async ({ id, payer, purchase_units }: OrderResponseBody) => {
        let success: boolean;

        // extract all shipping info
        const { name, address: shippingAddress } = purchase_units[0].shipping as ShippingInfo;
        const shippingNames = getFirstAndLastName(name?.full_name);

        // extract all billing info
        const {name: payerName, address: billingAddress} = payer;
        const billingNames = {firstName: payerName?.given_name || '', lastName: payerName?.surname || ''};
        const phone = payer.phone?.phone_number.national_number || '';
        const email = payer.email_address || '';
        const isBillingAddressFilled = (
            !!billingAddress?.address_line_1
            && !!billingAddress.admin_area_1
            && !!billingAddress.admin_area_2
            && !!billingAddress.country_code
            && !!billingAddress.postal_code
        );

        // set customer
        const customerResult = await callGuestCustomerEndpoint(billingNames.firstName, billingNames.lastName, email);
        success = customerResult.success;

        // check if shipping and billing are the same
        const isSameNames = isObjectEquals(shippingNames, billingNames);
        const isSameAddress = isBillingAddressFilled && isObjectEquals(shippingAddress, billingAddress);
        const isBillingSame = isSameNames && isSameAddress;
        const formattedShippingAddress = formatPaypalToApiAddress(shippingAddress, shippingNames.firstName, shippingNames.lastName, phone);
        const formattedBillingAddress = formatPaypalToApiAddress(isBillingAddressFilled ? billingAddress : shippingAddress, billingNames.firstName, billingNames.lastName, phone);

        // check and update shipping address
        if (success) {
            const shippingAddressResponse = await callShippingAddressEndpoint(formattedShippingAddress, false);
            success = shippingAddressResponse.success;
        }

        // check and update billing address
        if (success) {
            const billingAddressToSet = isBillingSame ? formattedShippingAddress : formattedBillingAddress;
            const billingAddressResponse = await callBillingAddressEndpoint(billingAddressToSet, (!isBillingSame && isBillingAddressFilled));
            success = billingAddressResponse.success;
        }

        // update taxes
        if (success) {
            const taxResponse = await setTaxes(API_RETRY);
            success = taxResponse.success;
        }

        // add payment
        if (success) {
            const {order_total} = getApplicationState();
            const payment: IAddPaymentRequest = {
                token: `${id}:${payer.payer_id}`,
                nonce: `${id}:${payer.payer_id}`, // TODO: Temporarily required - It is not in the API documentation, but required for Paypal Express
                gateway_public_id: getPaypalGatewayPublicId(),
                currency: currencyCode,
                amount: order_total
            } as IAddPaymentRequest;
            const paymentResult = await addPayment(payment, API_RETRY);
            success = paymentResult.success;
        }

        // finalize order
        if (success) {
            orderProcessing();
        }
    });
}
