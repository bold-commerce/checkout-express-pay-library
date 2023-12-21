import {OnShippingChangeActions, OnShippingChangeData} from '@paypal/paypal-js/types/components/buttons';
import {
    getPaypalPatchOperations,
    API_RETRY,
    formatPaypalToApiAddress,
    isSimilarStrings,
    callShippingAddressEndpoint,
    paypalConstants,
    getPhoneNumber
} from 'src';
import {
    changeShippingLine,
    estimateShippingLines,
    estimateTaxes,
    getOrderInitialData,
    getShipping,
    getShippingLines,
    setTaxes,
} from '@boldcommerce/checkout-frontend-library';
import {OrderResponseBody, UpdateOrderRequestBody} from '@paypal/paypal-js/types/apis/orders';

export async function paypalOnShippingChange(data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void|OrderResponseBody> {
    const {shipping_address: address, selected_shipping_option: selectedOption} = data;
    const {reject, order: {patch: patch}} = actions;
    const {MAX_STRING_LENGTH: maxStringSize} = paypalConstants;
    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;

    if (address) {
        const formattedAddress = formatPaypalToApiAddress(address, undefined, undefined , getPhoneNumber());
        let success = false;
        if (rsaEnabled) {
            const shippingLinesResponse = await estimateShippingLines(formattedAddress, API_RETRY);
            if (shippingLinesResponse.success) {
                success = true;
            }
        } else {
            const shippingAddressResponse = await callShippingAddressEndpoint(formattedAddress, false);
            if (!shippingAddressResponse.success) {
                return reject();
            }
            const shippingLinesResponse = await getShippingLines(API_RETRY);
            if (shippingLinesResponse.success) {
                success = true;
            }
        }


        if (success) {
            const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
            if (selectedOption) {
                const option = shippingLines.find(line => isSimilarStrings(line.description.substring(0, maxStringSize), selectedOption.label));
                option && await changeShippingLine(option.id, API_RETRY);
            } else if (!selectedShipping && shippingLines.length > 0) {
                await changeShippingLine(shippingLines[0].id, API_RETRY);
            }
            await getShippingLines(API_RETRY);
        }
    }

    let taxResponse;
    if (rsaEnabled && address) {
        const formattedAddress = formatPaypalToApiAddress(address, undefined, undefined , getPhoneNumber());
        taxResponse = await estimateTaxes(formattedAddress, API_RETRY);
    } else {
        taxResponse = await setTaxes(API_RETRY);
    }

    if (taxResponse.success) {
        const patchOperations = getPaypalPatchOperations(!!selectedOption);
        return await patch(patchOperations as UpdateOrderRequestBody);
    }

    return reject();
}
