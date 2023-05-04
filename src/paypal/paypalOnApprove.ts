import {OnApproveActions, OnApproveData} from '@paypal/paypal-js/types/components/buttons';
import {OrderResponseBody, ShippingInfo} from '@paypal/paypal-js/types/apis/orders';
import {
    callBillingAddressEndpoint,
    callGuestCustomerEndpoint,
    callShippingAddressEndpoint,
    getFirstAndLastName,
    getTotals,
    isObjectEquals
} from 'src/utils';
import {formatPaypalToApiAddress} from 'src/paypal/formatPaypalToApiAddress';
import {
    addPayment,
    getCurrency,
    IAddPaymentRequest,
    setTaxes,
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/types';
import {getPaypalGatewayPublicId} from 'src/paypal/managePaypalState';
import {orderProcessing, displayError} from 'src/actions';

export async function paypalOnApprove(data: OnApproveData, actions: OnApproveActions): Promise<void> {
    const {iso_code: currencyCode} = getCurrency();
    return actions.order?.get().then(async ({ id, payer, purchase_units }: OrderResponseBody) => {

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
        const success = customerResult.success;
        if(!success){
            displayError('There was an unknown error while validating your customer information.', 'generic', 'unknown_error');
            return;
        }

        // check if shipping and billing are the same
        const isSameNames = isObjectEquals(shippingNames, billingNames);
        const isSameAddress = isBillingAddressFilled && isObjectEquals(shippingAddress, billingAddress);
        const isBillingSame = isSameNames && isSameAddress;
        const formattedShippingAddress = formatPaypalToApiAddress(shippingAddress, shippingNames.firstName, shippingNames.lastName, phone);
        const formattedBillingAddress = formatPaypalToApiAddress(isBillingAddressFilled ? billingAddress : shippingAddress, billingNames.firstName, billingNames.lastName, phone);

        // check and update shipping address
        const shippingAddressResponse = await callShippingAddressEndpoint(formattedShippingAddress, false);
        if(!shippingAddressResponse.success){
            displayError('There was an unknown error while validating your shipping address.', 'shipping', 'unknown_error');
            return;
        }


        // check and update billing address
        const billingAddressToSet = isBillingSame ? formattedShippingAddress : formattedBillingAddress;
        const billingAddressResponse = await callBillingAddressEndpoint(billingAddressToSet, (!isBillingSame && isBillingAddressFilled));
        if(!billingAddressResponse.success){
            displayError('There was an unknown error while validating your billing address.', 'generic', 'unknown_error');
            return;
        }


        // update taxes

        const taxResponse = await setTaxes(API_RETRY);
        if(!taxResponse.success){
            displayError('There was an unknown error while calculating the taxes.', 'payment_gateway', 'no_tax');
            return;
        }


        // add payment
        const totals = getTotals();
        const payment: IAddPaymentRequest = {
            token: `${id}:${payer.payer_id}`,
            nonce: `${id}:${payer.payer_id}`, // TODO: Temporarily required - It is not in the API documentation, but required for Paypal Express
            gateway_public_id: getPaypalGatewayPublicId(),
            currency: currencyCode,
            amount: totals.totalAmountDue
        } as IAddPaymentRequest;
        const paymentResult = await addPayment(payment, API_RETRY);
        if(!paymentResult.success){
            displayError('There was an unknown error while processing your payment.', 'payment_gateway', 'unknown_error');
            return;
        }

        // finalize order
        orderProcessing();
    });
}
