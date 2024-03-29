import {OnClickActions} from '@paypal/paypal-js/types/components/buttons';
import {getRefreshedApplicationState} from '@boldcommerce/checkout-frontend-library';

export async function paypalOnClick(data: Record<string, unknown>, actions: OnClickActions): Promise<void> {
    await getRefreshedApplicationState();
    return await actions.resolve();
}
