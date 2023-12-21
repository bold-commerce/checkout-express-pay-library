import IntermediatePaymentData = google.payments.api.IntermediatePaymentData;
import PaymentDataRequestUpdate = google.payments.api.PaymentDataRequestUpdate;
import {formatBraintreeShippingAddressGoogle} from 'src/braintree/google/formatBraintreeShippingAddressGoogle';
import {getBraintreeShippingOptionsGoogle} from 'src/braintree/google/getBraintreeShippingOptionsGoogle';
import {callShippingAddressEndpoint, getTotals, getValueByCurrency} from 'src/utils';
import {
    changeShippingLine,
    getCurrency,
    getOrderInitialData,
    getShipping,
    getShippingLines,
    setTaxes,
    estimateShippingLines,
    estimateTaxes,
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY, BRAINTREE_GOOGLE_EMPTY_SHIPPING_OPTION} from 'src/types';
import CallbackIntent = google.payments.api.CallbackIntent;
import {braintreeConstants} from 'src/variables';

export async function braintreeOnPaymentDataChangeGoogle(intermediatePaymentData: IntermediatePaymentData): Promise<PaymentDataRequestUpdate> {
    const {callbackTrigger, shippingAddress, shippingOptionData} = intermediatePaymentData;
    const paymentDataRequestUpdate: PaymentDataRequestUpdate = {};
    const intent = callbackTrigger === braintreeConstants.GOOGLEPAY_TRIGGER_INITIALIZE ? braintreeConstants.GOOGLEPAY_INTENT_SHIPPING_ADDRESS : callbackTrigger as CallbackIntent;
    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;

    switch (callbackTrigger) {
        case braintreeConstants.GOOGLEPAY_TRIGGER_INITIALIZE:
        case braintreeConstants.GOOGLEPAY_INTENT_SHIPPING_OPTION:
        case braintreeConstants.GOOGLEPAY_INTENT_SHIPPING_ADDRESS: {
            let shippingLinesResponse;
            const address = formatBraintreeShippingAddressGoogle(shippingAddress, true);
            if (rsaEnabled) {
                shippingLinesResponse = await estimateShippingLines(address, API_RETRY);
            } else {
                const shippingAddressResponse = await callShippingAddressEndpoint(address, false);
                if (!shippingAddressResponse.success) {
                    paymentDataRequestUpdate.error = {
                        reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_SHIPPING,
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
                totalPrice: getValueByCurrency(totalAmountDue, currencyCode),
                totalPriceStatus: 'ESTIMATED'
            };
            paymentDataRequestUpdate.newShippingOptionParameters = getBraintreeShippingOptionsGoogle();
            return paymentDataRequestUpdate;
        }

        default: return paymentDataRequestUpdate;
    }
}
