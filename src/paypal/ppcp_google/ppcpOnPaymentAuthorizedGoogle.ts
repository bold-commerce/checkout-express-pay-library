import {
    callBillingAddressEndpoint,
    callGuestCustomerEndpoint,
    callShippingAddressEndpoint,
    orderProcessing,
    getTotals,
    isObjectEquals,
    googlePayConstants,
    getPPCPGoogleCredentialsChecked, getPaypalNameSpace, IPaypalNamespaceGoogle,
    formatGooglePayContactToCheckoutAddress
} from 'src';
import {API_RETRY} from 'src/types';
import {
    addPayment,
    getCurrency,
    IAddPaymentRequest, IAddPaymentResponse, IApiSuccessResponse,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import PaymentData = google.payments.api.PaymentData;
import PaymentAuthorizationResult = google.payments.api.PaymentAuthorizationResult;
import PaymentMethodData = google.payments.api.PaymentMethodData;
import CardInfo = google.payments.api.CardInfo;
import PaymentDataError = google.payments.api.PaymentDataError;

export async function ppcpOnPaymentAuthorizedGoogle(paymentData: PaymentData): Promise<PaymentAuthorizationResult> {
    const {email, shippingAddress, paymentMethodData} = paymentData;
    const {info, description} = paymentMethodData as PaymentMethodData;
    const {billingAddress} = info as CardInfo;
    const error: PaymentDataError = {
        reason: googlePayConstants.GOOGLEPAY_ERROR_REASON_PAYMENT,
        intent: googlePayConstants.GOOGLEPAY_INTENT_PAYMENT_AUTHORIZATION,
        message: ''
    };

    const formattedShippingAddress = formatGooglePayContactToCheckoutAddress(shippingAddress);
    const formattedBillingAddress = formatGooglePayContactToCheckoutAddress(billingAddress);
    const isSameAddress = isObjectEquals(formattedShippingAddress, formattedBillingAddress);

    const customerResult = await callGuestCustomerEndpoint(formattedBillingAddress.first_name, formattedBillingAddress.last_name, email ?? '');
    if (!customerResult.success) {
        error.message = customerResult.error?.message ?? 'There was an unknown error while validating your customer information.';
        return {
            transactionState: googlePayConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR,
            error
        };
    }
    const shippingAddressResponse = await callShippingAddressEndpoint(formattedShippingAddress, true);
    if (!shippingAddressResponse.success) {
        error.reason = googlePayConstants.GOOGLEPAY_ERROR_REASON_SHIPPING;
        error.message = shippingAddressResponse.error?.message ?? 'There was an unknown error while validating your shipping address.';
        return {
            transactionState: googlePayConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR,
            error
        };
    }
    const billingAddressResponse = await callBillingAddressEndpoint(formattedBillingAddress, !isSameAddress);
    if (!billingAddressResponse.success) {
        error.message = billingAddressResponse.error?.message ?? 'There was an unknown error while validating your billing address.';
        return {
            transactionState: googlePayConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR,
            error
        };
    }
    const taxResponse = await setTaxes(API_RETRY);
    if (!taxResponse.success) {
        error.message = taxResponse.error?.message ?? 'There was an unknown error while calculating the taxes.';
        return {
            transactionState: googlePayConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR,
            error
        };
    }

    const {public_id: gatewayPublicId} = getPPCPGoogleCredentialsChecked();
    const {iso_code: currencyCode} = getCurrency();
    const {totalAmountDue} = getTotals();
    const payment: IAddPaymentRequest = {
        token: JSON.stringify(paymentData.paymentMethodData),
        gateway_public_id: gatewayPublicId,
        currency: currencyCode,
        amount: totalAmountDue,
        display_string: description,
        wallet_pay_type: 'paywithgoogle',
        extra_payment_data: {
            brand: paymentData.paymentMethodData.info?.cardNetwork,
            last_digits: paymentData.paymentMethodData.info?.cardDetails,
            paymentSource: 'google_pay',
            language: navigator.language,
        }
    };
    const paymentResult = await addPayment(payment, API_RETRY);
    if (!paymentResult.success) {
        error.message = paymentResult.error?.message ?? 'There was an unknown error while processing your payment.';
        return {
            transactionState: googlePayConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR,
            error
        };
    } else {
        const successResponse = paymentResult.response as IApiSuccessResponse;
        const {payment: addedPayment} = successResponse.data as IAddPaymentResponse;
        const paypal = getPaypalNameSpace() as IPaypalNamespaceGoogle;
        await paypal.Googlepay().confirmOrder({
            orderId: addedPayment.token,
            paymentMethodData: paymentData.paymentMethodData
        });
    }
    orderProcessing();
    return {transactionState: googlePayConstants.GOOGLEPAY_TRANSACTION_STATE_SUCCESS};
}
