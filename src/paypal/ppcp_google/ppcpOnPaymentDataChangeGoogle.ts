import {
    API_RETRY, BRAINTREE_GOOGLE_EMPTY_SHIPPING_OPTION,
    callShippingAddressEndpoint, getPPCPGooglePayConfigChecked,
    getTotals,
    getValueByCurrency, googlePayConstants,
    formatGooglePayContactToCheckoutAddress, getPPCPShippingOptionsGoogle
} from 'src';
import {
    getCurrency,
    getShipping,
    getShippingLines,
    setTaxes,
    estimateShippingLines,
    estimateTaxes,
    getOrderInitialData,
    changeShippingLine
} from '@boldcommerce/checkout-frontend-library';
import IntermediatePaymentData = google.payments.api.IntermediatePaymentData;
import PaymentDataRequestUpdate = google.payments.api.PaymentDataRequestUpdate;
import CallbackIntent = google.payments.api.CallbackIntent;

export async function ppcpOnPaymentDataChangeGoogle(intermediatePaymentData: IntermediatePaymentData): Promise<PaymentDataRequestUpdate> {
    const {countryCode} = getPPCPGooglePayConfigChecked();
    const {callbackTrigger, shippingAddress, shippingOptionData} = intermediatePaymentData;
    const paymentDataRequestUpdate: PaymentDataRequestUpdate = {};
    const intent = callbackTrigger === googlePayConstants.GOOGLEPAY_TRIGGER_INITIALIZE ? googlePayConstants.GOOGLEPAY_INTENT_SHIPPING_ADDRESS : callbackTrigger as CallbackIntent;
    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;

    switch (callbackTrigger) {
        case googlePayConstants.GOOGLEPAY_TRIGGER_INITIALIZE:
        case googlePayConstants.GOOGLEPAY_INTENT_SHIPPING_OPTION:
        case googlePayConstants.GOOGLEPAY_INTENT_SHIPPING_ADDRESS: {
            let shippingLinesResponse;
            const address = formatGooglePayContactToCheckoutAddress(shippingAddress, true);
            if (rsaEnabled) {
                shippingLinesResponse = await estimateShippingLines(address, API_RETRY);
            } else {
                const shippingAddressResponse = await callShippingAddressEndpoint(address, false);
                if (!shippingAddressResponse.success) {
                    paymentDataRequestUpdate.error = {
                        reason: googlePayConstants.GOOGLEPAY_ERROR_REASON_SHIPPING,
                        message: shippingAddressResponse.error?.message ?? '',
                        intent
                    };
                    return paymentDataRequestUpdate;
                }
                shippingLinesResponse = await getShippingLines(API_RETRY);
            }

            const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
            if (shippingLinesResponse.success) {
                if (shippingOptionData && shippingOptionData.id !== BRAINTREE_GOOGLE_EMPTY_SHIPPING_OPTION) {
                    const option = shippingLines.find(line => line.id === shippingOptionData.id);
                    option && await changeShippingLine(option.id, API_RETRY);
                } else if (!selectedShipping && shippingLines.length > 0) {
                    await changeShippingLine(shippingLines[0].id, API_RETRY);
                }
                await getShippingLines(API_RETRY);
            }

            if (rsaEnabled) {
                await estimateTaxes(address, API_RETRY);
            } else {
                await setTaxes(API_RETRY);
            }

            const {iso_code: currencyCode} = getCurrency();
            const {totalAmountDue} = getTotals();
            paymentDataRequestUpdate.newTransactionInfo = {
                currencyCode: currencyCode,
                countryCode: countryCode,
                totalPrice: getValueByCurrency(totalAmountDue, currencyCode),
                totalPriceStatus: 'ESTIMATED'
            };
            paymentDataRequestUpdate.newShippingOptionParameters = getPPCPShippingOptionsGoogle();
            return paymentDataRequestUpdate;
        }

        default: return paymentDataRequestUpdate;
    }
}
