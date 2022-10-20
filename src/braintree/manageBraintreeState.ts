import {IExpressPayBraintreeApple, IExpressPayBraintreeGoogle} from '@bold-commerce/checkout-frontend-library';
import {braintreeState} from 'src';

export function setBraintreeGoogleCredentials(credentials: IExpressPayBraintreeGoogle | null): void {
    braintreeState.googleCredentials = credentials;
}

export function getBraintreeGoogleCredentials(): IExpressPayBraintreeGoogle | null {
    return braintreeState.googleCredentials;
}

export function setBraintreeAppleCredentials(credentials: IExpressPayBraintreeApple | null): void {
    braintreeState.appleCredentials = credentials;
}

export function getBraintreeAppleCredentials(): IExpressPayBraintreeApple | null {
    return braintreeState.appleCredentials;
}
