import {getOrderInitialData} from '@bold-commerce/checkout-frontend-library';
import {
    getBraintreeApplePayInstanceChecked,
    getBraintreeApplePaySessionChecked
} from 'src/braintree/manageBraintreeState';
import ApplePayValidateMerchantEvent = ApplePayJS.ApplePayValidateMerchantEvent;
import {displayError} from 'src/actions';
import {ApplePayValidateMerchantError} from 'src/types';

export async function braintreeOnValidateMerchantApple(event: ApplePayValidateMerchantEvent): Promise<void> {
    const appleInstance = getBraintreeApplePayInstanceChecked();
    const applePaySession = getBraintreeApplePaySessionChecked();
    const {shop_name: shopName} = getOrderInitialData();

    try {
        const merchantSession = await appleInstance.performValidation({
            validationURL: event.validationURL,
            displayName: shopName
        });
        applePaySession.completeMerchantValidation(merchantSession);
    } catch(e) {
        displayError('There was an error while loading Apple Pay.', 'generic', 'unknown_error');
        applePaySession.abort();

        if (e instanceof Error) {
            throw new ApplePayValidateMerchantError(e.message);
        }
        throw new ApplePayValidateMerchantError(`Error validating merchant: ${e}`);
    }
}
