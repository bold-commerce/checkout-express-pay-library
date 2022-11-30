import {IExpressPayBraintreeApple} from '@bold-commerce/checkout-frontend-library';
import {
    getBraintreeJsUrls,
    loadJS,
    braintreeOnLoadApple,
    braintreeOnLoadClient,
    setBraintreeAppleCredentials, braintreeConstants
} from 'src';

export async function initBraintreeApple(payment: IExpressPayBraintreeApple): Promise<void>  {
    const {clientJsURL, appleJsURL, dataCollectorJsURL} = getBraintreeJsUrls();

    setBraintreeAppleCredentials(payment);

    if (window.ApplePaySession
        && window.ApplePaySession.supportsVersion(braintreeConstants.APPLEPAY_VERSION_NUMBER)
        && window.ApplePaySession.canMakePayments()
    ) {
        await loadJS(clientJsURL, braintreeOnLoadClient);
        await loadJS(appleJsURL, braintreeOnLoadApple);
        await loadJS(dataCollectorJsURL);
    }
}
