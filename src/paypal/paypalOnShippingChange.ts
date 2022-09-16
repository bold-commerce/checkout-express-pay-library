import {OnShippingChangeActions, OnShippingChangeData} from '@paypal/paypal-js/types/components/buttons';
import {
    isAddressValid,
    getPaypalPatchOperations,
    IPaypalPatch,
    API_RETRY,
    formatPaypalToApiAddress,
    isObjectEmpty,
    paypalState,
    isSimilarStrings,
    isObjectEquals
} from 'src';
import {
    changeShippingLine,
    getShipping,
    getShippingAddress,
    getShippingLines,
    setShippingAddress,
    setTaxes,
    updateShippingAddress
} from '@bold-commerce/checkout-frontend-library';
import {OrderResponseBody} from '@paypal/paypal-js/types/apis/orders';

export async function paypalOnShippingChange(data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void|OrderResponseBody> {
    const {shipping_address: address, selected_shipping_option: selectedOption} = data;
    const {reject, order: {patch: unCastedPatch}} = actions;
    const {MAX_STRING_LENGTH: maxStringSize} = paypalState;
    const patch = unCastedPatch as IPaypalPatch;

    if (address) {
        const formattedAddress = formatPaypalToApiAddress(address);
        const shippingAddress = getShippingAddress();
        let success;

        if (!isObjectEquals(shippingAddress, formattedAddress)) {
            const isShippingAddressValid = await isAddressValid(
                address.country_code || '',
                address.state || '',
                address.postal_code || '',
                'shipping');
            if (!isShippingAddressValid) {
                return reject();
            }
        }

        if (isObjectEmpty(shippingAddress)) {
            const response = await setShippingAddress(formattedAddress, API_RETRY);
            success = response.success;
        } else {
            if (!isObjectEquals(shippingAddress, formattedAddress)) {
                const response = await updateShippingAddress(formattedAddress, API_RETRY);
                success = response.success;
            } else {
                success = true;
            }
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
        return await patch(patchOperations);
    }

    return reject();
}
