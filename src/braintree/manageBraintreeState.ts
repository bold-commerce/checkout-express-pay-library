import {IExpressPayBraintreeApple, IExpressPayBraintreeGoogle} from '@bold-commerce/checkout-frontend-library';
import {
    BraintreeNullStateKeyError,
    braintreeState,
    IBraintreeApplePayInstance,
    IBraintreeClient,
    IBraintreeGooglePayInstance
} from 'src';
import GooglePaymentsClient = google.payments.api.PaymentsClient;

export function setBraintreeGoogleCredentials(credentials: IExpressPayBraintreeGoogle | null): void {
    braintreeState.googleCredentials = credentials;
}

export function getBraintreeGoogleCredentials(): IExpressPayBraintreeGoogle | null {
    return braintreeState.googleCredentials;
}

export function getBraintreeGoogleCredentialsChecked(): IExpressPayBraintreeGoogle {
    if (!braintreeState.googleCredentials) {
        throw new BraintreeNullStateKeyError('Precondition violated: googleCredentials is null');
    }
    return braintreeState.googleCredentials;
}

export function setBraintreeAppleCredentials(credentials: IExpressPayBraintreeApple | null): void {
    braintreeState.appleCredentials = credentials;
}

export function getBraintreeAppleCredentials(): IExpressPayBraintreeApple | null {
    return braintreeState.appleCredentials;
}

export function getBraintreeAppleCredentialsChecked(): IExpressPayBraintreeApple {
    if (!braintreeState.appleCredentials) {
        throw new BraintreeNullStateKeyError('Precondition violated: appleCredentials is null');
    }
    return braintreeState.appleCredentials;
}

export function setBraintreeClient(braintree: IBraintreeClient | null): void {
    braintreeState.braintree = braintree;
}

export function getBraintreeClient(): IBraintreeClient | null {
    return braintreeState.braintree;
}

export function hasBraintreeClient(): boolean {
    return !!braintreeState.braintree;
}

export function setBraintreeApplePayInstance(applePayInstance: IBraintreeApplePayInstance | null): void {
    braintreeState.appleInstance = applePayInstance;
}

export function getBraintreeApplePayInstance(): IBraintreeApplePayInstance | null {
    return braintreeState.appleInstance;
}

export function getBraintreeApplePayInstanceChecked(): IBraintreeApplePayInstance {
    if (!braintreeState.appleInstance) {
        throw new BraintreeNullStateKeyError('Precondition violated: appleInstance is null');
    }
    return braintreeState.appleInstance;
}

export function setBraintreeApplePaySession(applePaySession: ApplePaySession | null): void {
    braintreeState.appleSession = applePaySession;
}

export function getBraintreeApplePaySession(): ApplePaySession | null {
    return braintreeState.appleSession;
}

export function getBraintreeApplePaySessionChecked(): ApplePaySession {
    if (!braintreeState.appleSession) {
        throw new BraintreeNullStateKeyError('Precondition violated: appleSession is null');
    }
    return braintreeState.appleSession;
}

export function setBraintreeGooglePayInstance(googlePayInstance: IBraintreeGooglePayInstance | null): void {
    braintreeState.googlePayInstance = googlePayInstance;
}

export function getBraintreeGooglePayInstance(): IBraintreeGooglePayInstance | null {
    return braintreeState.googlePayInstance;
}

export function getBraintreeGooglePayInstanceChecked(): IBraintreeGooglePayInstance {
    if (!braintreeState.googlePayInstance) {
        throw new BraintreeNullStateKeyError('Precondition violated: googlePayInstance is null');
    }
    return braintreeState.googlePayInstance;
}

export function setBraintreeGooglePayClient(googlePayClient: GooglePaymentsClient | null): void {
    braintreeState.googlePayClient = googlePayClient;
}

export function getBraintreeGooglePayClient(): GooglePaymentsClient | null {
    return braintreeState.googlePayClient;
}

export function getBraintreeGooglePayClientChecked(): GooglePaymentsClient {
    if (!braintreeState.googlePayClient) {
        throw new BraintreeNullStateKeyError('Precondition violated: googlePayClient is null');
    }
    return braintreeState.googlePayClient;
}
