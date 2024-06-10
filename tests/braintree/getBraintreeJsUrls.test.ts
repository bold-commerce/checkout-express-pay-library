import {getBraintreeJsUrls, IBraintreeUrls} from 'src';

describe('testing getBraintreeJsUrls function', () => {

    test('is getting the correct Urls', () => {
        const expected: IBraintreeUrls = {
            clientJsURL: 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/client.min.js',
            googleJsUrl: 'https://pay.google.com/gp/p/js/pay.js',
            dataCollectorJsURL: 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/data-collector.min.js',
            appleJsURL: 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/apple-pay.min.js',
            braintreeGoogleJsURL: 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/google-payment.min.js',
            fastlaneJsURL: 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/fastlane.min.js',
            paypalCheckoutURL: 'https://js.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/paypal-checkout.min.js',
        };

        const result = getBraintreeJsUrls();

        expect(result).toStrictEqual(expected);
    });

    test('is getting the correct Urls with specified version', () => {
        // Arranging
        const expected: IBraintreeUrls = {
            clientJsURL: 'https://js.braintreegateway.com/web/testing/js/client.min.js',
            googleJsUrl: 'https://pay.google.com/gp/p/js/pay.js',
            dataCollectorJsURL: 'https://js.braintreegateway.com/web/testing/js/data-collector.min.js',
            appleJsURL: 'https://js.braintreegateway.com/web/testing/js/apple-pay.min.js',
            braintreeGoogleJsURL: 'https://js.braintreegateway.com/web/testing/js/google-payment.min.js',
            fastlaneJsURL: 'https://js.braintreegateway.com/web/testing/js/fastlane.min.js',
            paypalCheckoutURL: 'https://js.braintreegateway.com/web/testing/js/paypal-checkout.min.js',
        };
        
        // Acting
        const result = getBraintreeJsUrls('testing');

        // Asserting
        expect(result).toStrictEqual(expected);
    });
});
