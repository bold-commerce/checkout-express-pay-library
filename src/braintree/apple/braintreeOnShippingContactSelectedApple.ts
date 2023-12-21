import {getBraintreeApplePaySessionChecked} from 'src/braintree/manageBraintreeState';
import ApplePayShippingContactSelectedEvent = ApplePayJS.ApplePayShippingContactSelectedEvent;
import {
    API_RETRY,
    callShippingAddressEndpoint,
    formatApplePayContactToCheckoutAddress,
    getPaymentRequestDisplayItems,
    getTotals,
    getValueByCurrency,
} from 'src';
import {
    changeShippingLine,
    estimateShippingLines,
    estimateTaxes,
    getCurrency,
    getOrderInitialData,
    getShipping,
    getShippingLines,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';

export async function braintreeOnShippingContactSelectedApple(event: ApplePayShippingContactSelectedEvent): Promise<void> {
    const {iso_code: currencyCode} = getCurrency();
    const applePaySession = getBraintreeApplePaySessionChecked();
    const shippingAddress = event.shippingContact;
    const address = formatApplePayContactToCheckoutAddress(shippingAddress, true);
    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;

    const fail = () => {
        const {totalAmountDue} = getTotals();
        applePaySession.completeShippingContactSelection({
            errors: [new ApplePayError('shippingContactInvalid')],
            newTotal: {label: 'Total', amount: getValueByCurrency(totalAmountDue, currencyCode)},
        });
    };

    let responseSuccess = false;
    if (rsaEnabled) {
        const estimateShippingResponse = await estimateShippingLines(address, API_RETRY);
        if (estimateShippingResponse.success) {
            const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
            if (!selectedShipping && shippingLines.length > 0) {
                await changeShippingLine(shippingLines[0].id, API_RETRY);
            }
            await getShippingLines(API_RETRY);
        }
        const estimateTaxResponse = await estimateTaxes(address, API_RETRY);
        if (estimateShippingResponse.success && estimateTaxResponse.success) {
            responseSuccess = true;
        }
    } else {
        const shippingResponse = await callShippingAddressEndpoint(address, false);
        if (shippingResponse.success) {
            const shippingLinesResponse = await getShippingLines(API_RETRY);
            const taxResponse = await setTaxes(API_RETRY);
            if (shippingLinesResponse.success && taxResponse.success) {
                responseSuccess = true;
            }
        }
    }

    if (responseSuccess) {
        const {totalAmountDue} = getTotals();
        const displayItems = getPaymentRequestDisplayItems().map(
            ({label, amount}) => ({
                label,
                amount: getValueByCurrency(amount, currencyCode),
            }));
        const {available_shipping_lines: shippingLines} = getShipping();

        const shippingOptions = shippingLines.map(p => ({
            label: p.description,
            detail: '',
            amount: getValueByCurrency(p.amount, currencyCode),
            identifier: p.id
        }));

        applePaySession.completeShippingContactSelection({
            newLineItems: displayItems,
            newShippingMethods: shippingOptions,
            newTotal: {label: 'Total', amount: getValueByCurrency(totalAmountDue, currencyCode)},
        });

    } else {
        fail();
    }
}
