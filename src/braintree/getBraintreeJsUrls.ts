import {braintreeConstants, IBraintreeUrls} from 'src';

export function getBraintreeJsUrls(): IBraintreeUrls {
    const {
        BASE_JS_URL: base,
        APPLE_JS: appleJs,
        GOOGLE_JS: googleJs,
        CLIENT_JS: clientJs,
        DATA_COLLECTOR_JS: dataCollectorJs,
        GOOGLE_JS_URL: googleJsUrl,
        JS_VERSION: jsVersion
    } = braintreeConstants;
    const clientJsURL = `${base}/${jsVersion}/${clientJs}`;
    const appleJsURL = `${base}/${jsVersion}/${appleJs}`;
    const braintreeGoogleJsURL = `${base}/${jsVersion}/${googleJs}`;
    const dataCollectorJsURL = `${base}/${jsVersion}/${dataCollectorJs}`;

    return {appleJsURL, clientJsURL, dataCollectorJsURL, googleJsUrl, braintreeGoogleJsURL};
}
