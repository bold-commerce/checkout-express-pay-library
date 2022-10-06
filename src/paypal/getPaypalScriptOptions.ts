import {PayPalScriptOptions} from '@paypal/paypal-js/types/script-options';
import {getCurrency} from '@bold-commerce/checkout-frontend-library';

export function getPaypalScriptOptions(clientId: string, debug: boolean): PayPalScriptOptions {
    const {iso_code: currency} = getCurrency();
    return {
        'client-id': clientId,
        debug,
        currency,
        'disable-funding': 'credit,card,venmo,sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort',
        'vault': 'true',
        'intent': 'authorize',
        'integration-date': '2020-03-10'
    };
}