import {OnApproveActions, OnApproveData} from '@paypal/paypal-js/types/components/buttons';
import {OrderResponseBody, ShippingInfo} from '@paypal/paypal-js/types/apis/orders';
import {getFirstAndLastName, getPhoneNumber, getTotals,} from 'src/utils';
import {formatPaypalToApiAddress} from 'src/paypal/formatPaypalToApiAddress';
import {addPayment, apiTypeKeys, batchRequest, getCurrency, IAddPaymentRequest, IBatchableRequest, buildAddressBatchRequest, buildCustomerBatchRequest} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/types';
import {getPaypalGatewayPublicId} from 'src/paypal/managePaypalState';
import {orderProcessing, displayError} from 'src/actions';

export async function ppcpOnApprove(data: OnApproveData, actions: OnApproveActions): Promise<void> {
    const {iso_code: currencyCode} = getCurrency();
    return actions.order?.get().then(async ({ payer, purchase_units, payment_source}: OrderResponseBody) => {

        // Build Batch Requests
        const requests: Array<IBatchableRequest> = [];

        // extract all shipping info
        const { name, address: shippingAddress } = purchase_units[0].shipping as ShippingInfo;
        const shippingNames = getFirstAndLastName(name?.full_name);

        // extract all billing info
        const {name: payerName, address: billingAddress} = payer;
        const billingNames = {firstName: payerName?.given_name || '', lastName: payerName?.surname || ''};
        const phone = getPhoneNumber(payer.phone?.phone_number.national_number);
        const email = payer.email_address || '';
        const isBillingAddressFilled = (
            !!billingAddress?.address_line_1
            && !!billingAddress.admin_area_1
            && !!billingAddress.admin_area_2
            && !!billingAddress.country_code
            && !!billingAddress.postal_code
        );

        const formattedShippingAddress = formatPaypalToApiAddress(shippingAddress, shippingNames.firstName, shippingNames.lastName, phone);
        const formattedBillingAddress = formatPaypalToApiAddress(isBillingAddressFilled ? billingAddress : shippingAddress, billingNames.firstName, billingNames.lastName, phone);

        const shippingAddressRequest = buildAddressBatchRequest(formattedShippingAddress, 'shipping');
        const billingAddressRequest = buildAddressBatchRequest(formattedBillingAddress, 'billing');

        const customerRequest = buildCustomerBatchRequest(billingNames.firstName, billingNames.lastName, email);

        customerRequest && requests.push(customerRequest);
        shippingAddressRequest && requests.push(shippingAddressRequest);
        billingAddressRequest && requests.push(billingAddressRequest);
        requests.push({apiType: apiTypeKeys.setTaxes, payload: {}});

        const batchResponse = await batchRequest(requests, API_RETRY);

        if (batchResponse.success) {
            // add payment
            const totals = getTotals();
            const payment: IAddPaymentRequest = {
                token: data.orderID,
                gateway_public_id: getPaypalGatewayPublicId(),
                currency: currencyCode,
                amount: totals.totalAmountDue,
                wallet_pay_type: 'paypal',
                extra_payment_data: {
                    orderId: data.orderID,
                    facilitatorAccessToken: data.facilitatorAccessToken,
                    payerId: data.payerID,
                    paymentSource: payment_source,
                }
            } as IAddPaymentRequest;
            const paymentResult = await addPayment(payment, API_RETRY);
            if (!paymentResult.success) {
                displayError('There was an unknown error while processing your payment.', 'payment_gateway', 'unknown_error');
                return;
            }
            // finalize order
            orderProcessing();
        } else {
            displayError('There was an unknown error while processing your payment.', 'payment_gateway', 'unknown_error');
            return;
        }
    });
}
