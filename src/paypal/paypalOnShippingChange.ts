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
    getShipping,
    getShippingLines,
    setTaxes,
} from '@boldcommerce/checkout-frontend-library';
import {OrderResponseBody, UpdateOrderRequestBody} from '@paypal/paypal-js/types/apis/orders';

export async function paypalOnShippingChange(data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void|OrderResponseBody> {
    const {shipping_address: address, selected_shipping_option: selectedOption} = data;
    const {reject, order: {patch: patch}} = actions;
    const {MAX_STRING_LENGTH: maxStringSize} = paypalConstants;

    if (address) {
        const formattedAddress = formatPaypalToApiAddress(address, undefined, undefined , getPhoneNumber());
        const success = true;

        const shippingAddressResponse = await callShippingAddressEndpoint(formattedAddress, false);
        if (!shippingAddressResponse.success) {
            return reject();
        }

        if(success) {
            const shippingLinesResponse = await getShippingLines(API_RETRY);
            const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
            if (shippingLinesResponse.success) {
                if (selectedOption) {
                    const option = shippingLines.find(line => isSimilarStrings(line.description.substring(0, maxStringSize), selectedOption.label));
                    option && await changeShippingLine(option.id, API_RETRY);
                } else if (!selectedShipping && shippingLines.length > 0) {
                    await changeShippingLine(shippingLines[0].id, API_RETRY);
                }
                await getShippingLines(API_RETRY);
            }
        }
    }
    const taxResponse = await setTaxes(API_RETRY);

    if (taxResponse.success) {
        const patchOperations = getPaypalPatchOperations(!!selectedOption);
        return await patch(patchOperations as UpdateOrderRequestBody);
    }

    return reject();
}
