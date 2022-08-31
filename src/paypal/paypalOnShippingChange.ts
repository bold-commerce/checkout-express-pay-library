import {OnShippingChangeActions, OnShippingChangeData} from '@paypal/paypal-js/types/components/buttons';

export async function paypalOnShippingChange(data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void> {
    //TODO: Place holder function to be implemented.
    // eslint-disable-next-line no-console
    console.log({data, actions});
}
