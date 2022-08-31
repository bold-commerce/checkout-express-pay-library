import {OnApproveActions, OnApproveData} from '@paypal/paypal-js/types/components/buttons';

export async function paypalOnApprove(data: OnApproveData, actions: OnApproveActions): Promise<void> {
    //TODO: Place holder function to be implemented.
    // eslint-disable-next-line no-console
    console.log({data, actions});
}
