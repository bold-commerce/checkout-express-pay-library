import {
    formatApplePayContactToCheckoutAddress,
    callBillingAddressEndpoint,
    callGuestCustomerEndpoint,
    callShippingAddressEndpoint,
    isObjectEquals,
    orderProcessing,
    braintreeConstants,
    getBraintreeAppleCredentialsChecked,
    getBraintreeApplePayInstanceChecked,
    getBraintreeApplePaySessionChecked,
    getTotals
} from 'src';
import {API_RETRY} from 'src/types';
import {
    addPayment,
    getCurrency,
    IAddPaymentRequest,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import ApplePayError = ApplePayJS.ApplePayError;
import ApplePayPaymentAuthorizedEvent = ApplePayJS.ApplePayPaymentAuthorizedEvent;
import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;

export async function braintreeOnPaymentAuthorizedApple(event: ApplePayPaymentAuthorizedEvent): Promise<void> {
    const appleInstance = getBraintreeApplePayInstanceChecked();
    const applePaySession = getBraintreeApplePaySessionChecked();
    const {token, shippingContact, billingContact} = event.payment;
    const {givenName, familyName, emailAddress} = shippingContact ?? {} as ApplePayPaymentContact;

    if (billingContact && !billingContact.phoneNumber && shippingContact?.phoneNumber) {
        billingContact.phoneNumber = shippingContact.phoneNumber;
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
            code: braintreeConstants.APPLEPAY_ERROR_CODE_SHIPPING_CONTACT,
            message: customerResult.error?.message ?? 'There was an unknown error while validating your customer information.'
        });
    }

    const shippingAddressResponse = await callShippingAddressEndpoint(shippingAddress, false);
    if (!shippingAddressResponse.success) {
        return fail({
            code: braintreeConstants.APPLEPAY_ERROR_CODE_SHIPPING_CONTACT,
            message: shippingAddressResponse.error?.message ?? 'There was an unknown error while validating your shipping address.'
        });
    }

    const billingAddressResponse = await callBillingAddressEndpoint(billingAddress, !isSameAddress);
    if (!billingAddressResponse.success) {
        return fail({
            code: braintreeConstants.APPLEPAY_ERROR_CODE_BILLING_CONTACT,
            message: billingAddressResponse.error?.message ?? 'There was an unknown error while validating your billing address.'
        });
    }

    const taxResponse = await setTaxes(API_RETRY);
    if (!taxResponse.success) {
        return fail({
            code: braintreeConstants.APPLEPAY_ERROR_CODE_UNKNOWN,
            message: taxResponse.error?.message ?? 'There was an unknown error while calculating the taxes.'
        });
    }

    try {
        const payload = await appleInstance.tokenize({token});

        const {nonce} = payload;
        const {public_id: gatewayPublicId} = getBraintreeAppleCredentialsChecked();
        const {iso_code: currencyCode} = getCurrency();
        const {totalAmountDue} = getTotals();

        const payment: IAddPaymentRequest = {
            token: nonce,
            gateway_public_id: gatewayPublicId,
            currency: currencyCode,
            amount: totalAmountDue,
            wallet_pay_type: 'applepay',
        };

        const paymentResult = await addPayment(payment, API_RETRY);
        if (!paymentResult.success) {
            return fail({
                code: braintreeConstants.APPLEPAY_ERROR_CODE_UNKNOWN,
                message: paymentResult.error?.message ?? 'There was an unknown error while processing your payment.'
            });
        }

        applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS);
        orderProcessing();
    } catch(e) {
        if (e instanceof Error) {
            return fail({
                code: braintreeConstants.APPLEPAY_ERROR_CODE_UNKNOWN,
                message: e.message
            });
        }

        return fail({
            code: braintreeConstants.APPLEPAY_ERROR_CODE_UNKNOWN,
            message: e ? `${e}` : 'There was an unknown error while processing your payment.'
        });
    }
}
