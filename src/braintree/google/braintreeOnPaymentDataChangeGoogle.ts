import IntermediatePaymentData = google.payments.api.IntermediatePaymentData;
import PaymentDataRequestUpdate = google.payments.api.PaymentDataRequestUpdate;
import {formatBraintreeShippingAddressGoogle} from 'src/braintree/google/formatBraintreeShippingAddressGoogle';
import {getBraintreeShippingOptionsGoogle} from 'src/braintree/google/getBraintreeShippingOptionsGoogle';
import {callShippingAddressEndpoint, getTotals, getValueByCurrency} from 'src/utils';
import {
    changeShippingLine,
    getCurrency,
    getShipping,
    getShippingLines,
    setTaxes
} from '@bold-commerce/checkout-frontend-library';
import {API_RETRY} from 'src/types';
import CallbackIntent = google.payments.api.CallbackIntent;
import {braintreeConstants} from 'src/variables';

export async function braintreeOnPaymentDataChangeGoogle(intermediatePaymentData: IntermediatePaymentData): Promise<PaymentDataRequestUpdate> {
    const {callbackTrigger, shippingAddress, shippingOptionData} = intermediatePaymentData;
    const paymentDataRequestUpdate: PaymentDataRequestUpdate = {};
    const intent = callbackTrigger === braintreeConstants.GOOGLEPAY_TRIGGER_INITIALIZE ? braintreeConstants.GOOGLEPAY_INTENT_SHIPPING_ADDRESS : callbackTrigger as CallbackIntent;

    switch (callbackTrigger) {
        case braintreeConstants.GOOGLEPAY_TRIGGER_INITIALIZE:
        case braintreeConstants.GOOGLEPAY_INTENT_SHIPPING_OPTION:
        case braintreeConstants.GOOGLEPAY_INTENT_SHIPPING_ADDRESS: {
            if (shippingAddress) {
                const address = formatBraintreeShippingAddressGoogle(shippingAddress);
                const shippingAddressResponse = await callShippingAddressEndpoint(address, true);
                if (!shippingAddressResponse.success) {
                    paymentDataRequestUpdate.error = {
                        reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_SHIPPING,
                        message: shippingAddressResponse.error?.message ?? '',
                        intent
                    };
                    return paymentDataRequestUpdate;
                }
            }
            const shippingLinesResponse = await getShippingLines(API_RETRY);
            const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
            if (shippingLinesResponse.success) {
                if (shippingOptionData) {
                    const option = shippingLines.find(line => line.id === shippingOptionData.id);
                    option && await changeShippingLine(option.id, API_RETRY);
                } else if (!selectedShipping && shippingLines.length > 0) {
                    await changeShippingLine(shippingLines[0].id, API_RETRY);
                }
                await getShippingLines(API_RETRY);
            }

            await setTaxes(API_RETRY);

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
