import {getBraintreeJsUrls, IBraintreeUrls} from 'src';

describe('testing getBraintreeJsUrls function', () => {

    test('is getting the correct Urls', () => {
        const expected: IBraintreeUrls = {
            clientJsURL: 'https://js.braintreegateway.com/web/3.77.0/js/client.min.js',
            googleJsUrl: 'https://pay.google.com/gp/p/js/pay.js',
            dataCollectorJsURL: 'https://js.braintreegateway.com/web/3.77.0/js/data-collector.min.js',
            appleJsURL: 'https://js.braintreegateway.com/web/3.77.0/js/apple-pay.min.js'
        };

        const result = getBraintreeJsUrls();

        expect(result).toStrictEqual(expected);
    });

});
