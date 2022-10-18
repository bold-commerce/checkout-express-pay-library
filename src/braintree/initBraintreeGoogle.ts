import {IExpressPayBraintreeGoogle} from '@bold-commerce/checkout-frontend-library';
import {loadJS, getBraintreeJsUrls, setBraintreeGoogleCredentials} from 'src';

export async function initBraintreeGoogle(payment: IExpressPayBraintreeGoogle): Promise<void>  {
    const {clientJsURL, googleJsUrl, dataCollectorJsURL} = getBraintreeJsUrls();

    setBraintreeGoogleCredentials(payment);

    await loadJS(clientJsURL); // TODO Add OnLoad Braintree client Js function as a second param
    await loadJS(googleJsUrl); // TODO Add OnLoad Google Js function as a second param
    await loadJS(dataCollectorJsURL);
}
