import {
    addPayment,
    getCurrency,
    IAddPaymentRequest,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import {
    formatBraintreeShippingAddressGoogle,
    orderProcessing,
    callBillingAddressEndpoint,
    callGuestCustomerEndpoint,
    callShippingAddressEndpoint,
    isObjectEquals,
    IBraintreeGooglePayPaymentData,
    braintreeConstants,
    getBraintreeGoogleCredentialsChecked,
    getBraintreeGooglePayInstanceChecked,
    getTotals
} from 'src';
import {API_RETRY} from 'src/types';
import PaymentData = google.payments.api.PaymentData;
import PaymentAuthorizationResult = google.payments.api.PaymentAuthorizationResult;
import PaymentMethodData = google.payments.api.PaymentMethodData;
import CardInfo = google.payments.api.CardInfo;
import PaymentDataError = google.payments.api.PaymentDataError;

export async function braintreeOnPaymentAuthorizedGoogle(paymentData: PaymentData): Promise<PaymentAuthorizationResult> {
    const {email, shippingAddress, paymentMethodData} = paymentData;
    const {info, description} = paymentMethodData as PaymentMethodData;
    const {billingAddress} = info as CardInfo;
    const error: PaymentDataError = {
        reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_PAYMENT,
        intent: braintreeConstants.GOOGLEPAY_INTENT_PAYMENT_AUTHORIZATION,
        message: ''
    };
    const googlePaymentInstance = getBraintreeGooglePayInstanceChecked();
    const {nonce} = await googlePaymentInstance.parseResponse(paymentData) as IBraintreeGooglePayPaymentData;

    const formattedShippingAddress = formatBraintreeShippingAddressGoogle(shippingAddress);
    const formattedBillingAddress = formatBraintreeShippingAddressGoogle(billingAddress);
    const isSameAddress = isObjectEquals(formattedShippingAddress, formattedBillingAddress);

    const customerResult = await callGuestCustomerEndpoint(formattedBillingAddress.first_name, formattedBillingAddress.last_name, email ?? '');
    if (!customerResult.success) {
        error.message = customerResult.error?.message ?? 'There was an unknown error while validating your customer information.';
        return {
            transactionState: braintreeConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR,
            error
        };
    }
    const shippingAddressResponse = await callShippingAddressEndpoint(formattedShippingAddress, false);
    if (!shippingAddressResponse.success) {
        error.reason = braintreeConstants.GOOGLEPAY_ERROR_REASON_SHIPPING;
        error.message = shippingAddressResponse.error?.message ?? 'There was an unknown error while validating your shipping address.';
        return {
            transactionState: braintreeConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR,
            error
        };
    }
    const billingAddressResponse = await callBillingAddressEndpoint(formattedBillingAddress, !isSameAddress);
    if (!billingAddressResponse.success) {
        error.message = billingAddressResponse.error?.message ?? 'There was an unknown error while validating your billing address.';
        return {
            transactionState: braintreeConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR,
            error
        };
    }
    const taxResponse = await setTaxes(API_RETRY);
    if (!taxResponse.success) {
        error.message = taxResponse.error?.message ?? 'There was an unknown error while calculating the taxes.';
        return {
            transactionState: braintreeConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR,
            error
        };
    }

    const {public_id: gatewayPublicId} = getBraintreeGoogleCredentialsChecked();
    const {iso_code: currencyCode} = getCurrency();
    const {totalAmountDue} = getTotals();
    const payment: IAddPaymentRequest = {
        token: nonce,
        gateway_public_id: gatewayPublicId,
        currency: currencyCode,
        amount: totalAmountDue,
        display_string: description
    };
    const paymentResult = await addPayment(payment, API_RETRY);
    if (!paymentResult.success) {
        error.message = paymentResult.error?.message ?? 'There was an unknown error while processing your payment.';
        return {
            transactionState: braintreeConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR,
            error
        };
    }
    orderProcessing();
    return {transactionState: braintreeConstants.GOOGLEPAY_TRANSACTION_STATE_SUCCESS};
}
