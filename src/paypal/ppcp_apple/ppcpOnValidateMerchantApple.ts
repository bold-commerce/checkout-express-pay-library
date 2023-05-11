import {getOrderInitialData} from '@boldcommerce/checkout-frontend-library';
import {displayError} from 'src/actions';
import {ApplePayValidateMerchantError} from 'src/types';
import {getPPCPApplePayInstanceChecked, getPPCPApplePaySessionChecked} from 'src/paypal';
import ApplePayValidateMerchantEvent = ApplePayJS.ApplePayValidateMerchantEvent;

export async function ppcpOnValidateMerchantApple(event: ApplePayValidateMerchantEvent): Promise<void> {
    const appleInstance = getPPCPApplePayInstanceChecked();
    const applePaySession = getPPCPApplePaySessionChecked();
    const {shop_name: shopName} = getOrderInitialData();

    try {
        const {merchantSession} = await appleInstance.validateMerchant({
            validationUrl: event.validationURL,
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
