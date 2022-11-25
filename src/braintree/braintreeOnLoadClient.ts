import {setBraintreeClient} from 'src';

export function braintreeOnLoadClient(): void {
    if (window.braintree) {
        setBraintreeClient(window.braintree);
    }
}
