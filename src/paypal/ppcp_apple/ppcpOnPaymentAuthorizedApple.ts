import {
    formatApplePayContactToCheckoutAddress,
    callBillingAddressEndpoint,
    callGuestCustomerEndpoint,
    callShippingAddressEndpoint,
    isObjectEquals,
    orderProcessing,
    applePayConstants,
    getTotals,
    getPPCPApplePayInstanceChecked,
    getPPCPApplePaySessionChecked,
    getPPCPAppleCredentialsChecked
} from 'src';
import {API_RETRY} from 'src/types';
import {
    addPayment,
    getCurrency,
    IAddPaymentRequest,
    IAddPaymentResponse,
    IApiSuccessResponse,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import ApplePayError = ApplePayJS.ApplePayError;
import ApplePayPaymentAuthorizedEvent = ApplePayJS.ApplePayPaymentAuthorizedEvent;
import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;

export async function ppcpOnPaymentAuthorizedApple(event: ApplePayPaymentAuthorizedEvent): Promise<void> {
    const appleInstance = getPPCPApplePayInstanceChecked();
    const applePaySession = getPPCPApplePaySessionChecked();
    const {token, shippingContact, billingContact} = event.payment;
    const {givenName, familyName, emailAddress, phoneNumber} = shippingContact ?? {} as ApplePayPaymentContact;

    if (billingContact && !billingContact.phoneNumber && phoneNumber) {
        billingContact.phoneNumber = phoneNumber;
    }

    const shippingAddress = formatApplePayContactToCheckoutAddress(shippingContact as ApplePayPaymentContact);
    const billingAddress = formatApplePayContactToCheckoutAddress(billingContact as ApplePayPaymentContact);
    const isSameAddress = isObjectEquals(shippingAddress, billingAddress);

    const fail = (error: ApplePayError) => {
        applePaySession.completePayment({
            status: ApplePaySession.STATUS_FAILURE,
            errors: [error]
        });
    };

    const customerResult = await callGuestCustomerEndpoint(givenName ?? '', familyName ?? '', emailAddress ?? '');
    if (!customerResult.success) {
        return fail({
            code: applePayConstants.APPLEPAY_ERROR_CODE_SHIPPING_CONTACT,
            message: customerResult.error?.message ?? 'There was an unknown error while validating your customer information.'
        });
    }

    const shippingAddressResponse = await callShippingAddressEndpoint(shippingAddress, false);
    if (!shippingAddressResponse.success) {
        return fail({
            code: applePayConstants.APPLEPAY_ERROR_CODE_SHIPPING_CONTACT,
            message: shippingAddressResponse.error?.message ?? 'There was an unknown error while validating your shipping address.'
        });
    }

    const billingAddressResponse = await callBillingAddressEndpoint(billingAddress, !isSameAddress);
    if (!billingAddressResponse.success) {
        return fail({
            code: applePayConstants.APPLEPAY_ERROR_CODE_BILLING_CONTACT,
            message: billingAddressResponse.error?.message ?? 'There was an unknown error while validating your billing address.'
        });
    }

    const taxResponse = await setTaxes(API_RETRY);
    if (!taxResponse.success) {
        return fail({
            code: applePayConstants.APPLEPAY_ERROR_CODE_UNKNOWN,
            message: taxResponse.error?.message ?? 'There was an unknown error while calculating the taxes.'
        });
    }

    try {
        const {public_id: gatewayPublicId} = getPPCPAppleCredentialsChecked();
        const {iso_code: currencyCode} = getCurrency();
        const {totalAmountDue} = getTotals();
        const displayNameArray = token.paymentMethod.displayName.split(' ');
        const displayNameLast = displayNameArray[displayNameArray.length -1]; // get last word of displayName - Last 4 digits

        const payment: IAddPaymentRequest = {
            token: 'tokenized_by_ppcp_apple_pay',
            gateway_public_id: gatewayPublicId,
            currency: currencyCode,
            amount: totalAmountDue,
            extra_payment_data: {
                brand: token.paymentMethod.network,
                last_digits: displayNameLast,
                paymentSource: 'apple_pay',
                language: navigator.language,
            }
        } as IAddPaymentRequest;

        const paymentResult = await addPayment(payment, API_RETRY);

        if (!paymentResult.success) {
            return fail({
                code: applePayConstants.APPLEPAY_ERROR_CODE_UNKNOWN,
                message: paymentResult.error?.message ?? 'There was an unknown error while processing your payment.'
            });
        }
        const successResponse = paymentResult.response as IApiSuccessResponse;
        const {payment: addedPayment} = successResponse.data as IAddPaymentResponse;
        const orderId = addedPayment.token;

        await appleInstance.confirmOrder({orderId, token, billingContact, shippingContact});
        applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS);
        orderProcessing();
    } catch(e) {
        if (e instanceof Error) {
            return fail({
                code: applePayConstants.APPLEPAY_ERROR_CODE_UNKNOWN,
                message: e.message
            });
        }

        return fail({
            code: applePayConstants.APPLEPAY_ERROR_CODE_UNKNOWN,
            message: e ? `${e}` : 'There was an unknown error while processing your payment.'
        });
    }
}
