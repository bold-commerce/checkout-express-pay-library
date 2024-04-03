import {braintreeConstants, IBraintreeUrls} from 'src';

/**
 * @param version If provided, URLs will be built with this version instead
 */
export function getBraintreeJsUrls(version?: string): IBraintreeUrls {
    const {
        BASE_JS_URL: base,
        APPLE_JS: appleJs,
        GOOGLE_JS: googleJs,
        CLIENT_JS: clientJs,
        FASTLANE_JS: fastlaneJs,
        DATA_COLLECTOR_JS: dataCollectorJs,
        GOOGLE_JS_URL: googleJsUrl,
        JS_VERSION: jsVersion
    } = braintreeConstants;
    version ??= jsVersion;
    const clientJsURL = `${base}/${version}/${clientJs}`;
    const appleJsURL = `${base}/${version}/${appleJs}`;
    const braintreeGoogleJsURL = `${base}/${version}/${googleJs}`;
    const dataCollectorJsURL = `${base}/${version}/${dataCollectorJs}`;
    const fastlaneJsURL = `${base}/${version}/${fastlaneJs}`;

    return {appleJsURL, clientJsURL, dataCollectorJsURL, googleJsUrl, braintreeGoogleJsURL, fastlaneJsURL};
}
