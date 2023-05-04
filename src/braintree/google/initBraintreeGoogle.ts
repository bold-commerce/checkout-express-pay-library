import {IExpressPayBraintreeGoogle} from '@boldcommerce/checkout-frontend-library';
import {
    loadJS,
    getBraintreeJsUrls,
    setBraintreeGoogleCredentials,
    braintreeOnLoadClient,
    braintreeOnLoadGoogle
} from 'src';

export async function initBraintreeGoogle(payment: IExpressPayBraintreeGoogle): Promise<void>  {
    const {clientJsURL, googleJsUrl, braintreeGoogleJsURL, dataCollectorJsURL} = getBraintreeJsUrls();

    setBraintreeGoogleCredentials(payment);

    await loadJS(clientJsURL, braintreeOnLoadClient);
    await loadJS(
        braintreeGoogleJsURL,
        braintreeOnLoadClient // Triggering onLoad Client again since window.braintree could have been reassigned by the new script
    );
    await loadJS(googleJsUrl, braintreeOnLoadGoogle);
    await loadJS(dataCollectorJsURL);
}
