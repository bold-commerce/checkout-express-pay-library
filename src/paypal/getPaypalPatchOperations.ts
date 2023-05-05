import {getPaypalAmountWithBreakdown, getPaypalShippingOptions, IPaypalPatchOperation} from 'src';
import {getShipping} from '@boldcommerce/checkout-frontend-library';

export function getPaypalPatchOperations(hasOptionSelected: boolean): Array<IPaypalPatchOperation> {
    const {available_shipping_lines: shippingLines} = getShipping();
    const patchOperations: Array<IPaypalPatchOperation> = [
        {
            op: 'replace',
            path: '/purchase_units/@reference_id==\'default\'/amount',
            value: getPaypalAmountWithBreakdown()
        }
    ];

    shippingLines?.length > 0 && patchOperations.push({
        op: hasOptionSelected ? 'replace' : 'add',
        path: '/purchase_units/@reference_id==\'default\'/shipping/options',
        value: getPaypalShippingOptions()
    });

    return patchOperations;
}
