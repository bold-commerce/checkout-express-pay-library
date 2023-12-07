import {PayPalScriptOptions} from '@paypal/paypal-js/types/script-options';
import {getCurrency} from '@boldcommerce/checkout-frontend-library';

export function getPaypalScriptOptions(clientId: string, debug: boolean, merchantId?: string, components?: string): PayPalScriptOptions {
    const {iso_code: currency} = getCurrency();
    return {
        'clientId': clientId,
        debug,
        currency,
        'disableFunding': 'credit,card,venmo,sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort',
        'vault': 'true',
        'intent': 'authorize',
        'integrationDate': '2020-03-10',
        'merchantId': merchantId,
        'components': components,
        'dataPartnerAttributionId': debug ? 'BoldCommerce_BT_TEST' : 'BoldCommerce_BT',
    };
}
