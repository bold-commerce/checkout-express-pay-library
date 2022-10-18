import {IExpressPayBraintreeApple} from '@bold-commerce/checkout-frontend-library';
import {getBraintreeJsUrls, loadJS, setBraintreeAppleCredentials} from 'src';

export async function initBraintreeApple(payment: IExpressPayBraintreeApple): Promise<void>  {
    const {clientJsURL, appleJsURL, dataCollectorJsURL} = getBraintreeJsUrls();

    setBraintreeAppleCredentials(payment);

    if (window.ApplePaySession && window.ApplePaySession.supportsVersion(3) && window.ApplePaySession.canMakePayments()) {
        await loadJS(clientJsURL); // TODO Add OnLoad Braintree client Js function as a second param
        await loadJS(appleJsURL); // TODO Add OnLoad Apple Js function as a second param
        await loadJS(dataCollectorJsURL);
    }
}
