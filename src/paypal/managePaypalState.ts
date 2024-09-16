import {IExpressPayPaypalCommercePlatform} from '@boldcommerce/checkout-frontend-library';
import {PayPalNamespace} from '@paypal/paypal-js';
import {
    PaypalNullStateKeyError,
    IPaypalNamespaceApple,
    IPPCPAppleConfig,
    IPPCPApplePayInstance,
    paypalState, IPaypalNamespaceGoogle, IPPCPGooglePayInstance, IPPCPGoogleConfig
} from 'src';
import PaymentsClient = google.payments.api.PaymentsClient;

export function setPaypalNameSpace(paypal: PayPalNamespace | IPaypalNamespaceApple | IPaypalNamespaceGoogle | null): void {
    paypalState.paypal = paypal;
}

export function setPaypalNameSpacePromise(paypal: Promise<PayPalNamespace | null> | null): void {
    paypalState.paypalPromise = paypal;
}

export function getPaypalNameSpacePromise(): Promise<PayPalNamespace | null> | null {
    return paypalState.paypalPromise;
}

export function getPaypalNameSpace(): PayPalNamespace | IPaypalNamespaceApple | IPaypalNamespaceGoogle | null {
    return paypalState.paypal;
}

export function hasPaypalNameSpace(): boolean {
    return !!paypalState.paypal;
}

export function hasPaypalNameSpaceApple(): boolean {
    const paypal = paypalState.paypal as IPaypalNamespaceApple;
    return !!paypal && !!paypal.Applepay;
}

export function hasPaypalNameSpaceGoogle(): boolean {
    const paypal = paypalState.paypal as IPaypalNamespaceGoogle;
    return !!paypal && !!paypal.Googlepay;
}

export function setPPCPApplePayInstance(ppcpApplePayInstance: IPPCPApplePayInstance | null): void {
    paypalState.ppcpApplePayInstance = ppcpApplePayInstance;
}

export function getPPCPApplePayInstance(): IPPCPApplePayInstance | null {
    return paypalState.ppcpApplePayInstance;
}

export function getPPCPApplePayInstanceChecked(): IPPCPApplePayInstance {
    if (!paypalState.ppcpApplePayInstance) {
        throw new PaypalNullStateKeyError('Precondition violated: ppcpApplePayInstance is null');
    }
    return paypalState.ppcpApplePayInstance;
}

export function setPPCPApplePayConfig(ppcpApplePayConfig: IPPCPAppleConfig | null): void {
    paypalState.ppcpApplePayConfig = ppcpApplePayConfig;
}

export function getPPCPApplePayConfig(): IPPCPAppleConfig | null {
    return paypalState.ppcpApplePayConfig;
}

export function getPPCPApplePayConfigChecked(): IPPCPAppleConfig {
    if (!paypalState.ppcpApplePayConfig) {
        throw new PaypalNullStateKeyError('Precondition violated: ppcpApplePayConfig is null');
    }
    return paypalState.ppcpApplePayConfig;
}

export function setPPCPApplePaySession(ppcpApplePaySession: ApplePaySession | null): void {
    paypalState.ppcpApplePaySession = ppcpApplePaySession;
}

export function getPPCPApplePaySession(): ApplePaySession | null {
    return paypalState.ppcpApplePaySession;
}

export function getPPCPApplePaySessionChecked(): ApplePaySession {
    if (!paypalState.ppcpApplePaySession) {
        throw new PaypalNullStateKeyError('Precondition violated: ppcpApplePaySession is null');
    }
    return paypalState.ppcpApplePaySession;
}
export function setPPCPGooglePayInstance(ppcpGooglePayInstance: IPPCPGooglePayInstance | null): void {
    paypalState.ppcpGooglePayInstance = ppcpGooglePayInstance;
}

export function getPPCPGooglePayInstance(): IPPCPGooglePayInstance | null {
    return paypalState.ppcpGooglePayInstance;
}

export function getPPCPGooglePayInstanceChecked(): IPPCPGooglePayInstance {
    if (!paypalState.ppcpGooglePayInstance) {
        throw new PaypalNullStateKeyError('Precondition violated: ppcpGooglePayInstance is null');
    }
    return paypalState.ppcpGooglePayInstance;
}

export function setPPCPGooglePayConfig(ppcpGooglePayConfig: IPPCPGoogleConfig | null): void {
    paypalState.ppcpGooglePayConfig = ppcpGooglePayConfig;
}

export function getPPCPGooglePayConfig(): IPPCPGoogleConfig | null {
    return paypalState.ppcpGooglePayConfig;
}

export function getPPCPGooglePayConfigChecked(): IPPCPGoogleConfig {
    if (!paypalState.ppcpGooglePayConfig) {
        throw new PaypalNullStateKeyError('Precondition violated: ppcpGooglePayConfig is null');
    }
    return paypalState.ppcpGooglePayConfig;
}

export function setPPCPGooglePaySession(ppcpGooglePaySession: PaymentsClient | null): void {
    paypalState.ppcpGooglePaySession = ppcpGooglePaySession;
}

export function getPPCPGooglePaySession(): PaymentsClient | null {
    return paypalState.ppcpGooglePaySession;
}

export function getPPCPGooglePaySessionChecked(): PaymentsClient {
    if (!paypalState.ppcpGooglePaySession) {
        throw new PaypalNullStateKeyError('Precondition violated: ppcpGooglePaySession is null');
    }
    return paypalState.ppcpGooglePaySession;
}


export function setPaypalGatewayPublicId(gatewayPublicId: string): void {
    paypalState.gatewayPublicId = gatewayPublicId;
}

export function getPaypalGatewayPublicId(): string {
    return paypalState.gatewayPublicId;
}

export function setPPCPAppleCredentials(credentials: IExpressPayPaypalCommercePlatform | null): void {
    paypalState.ppcpAppleCredentials = credentials;
}

export function getPPCPAppleCredentialsChecked(): IExpressPayPaypalCommercePlatform {
    if (!paypalState.ppcpAppleCredentials) {
        throw new PaypalNullStateKeyError('Precondition violated: ppcpAppleCredentials is null');
    }
    return paypalState.ppcpAppleCredentials;
}

export function setPPCPGoogleCredentials(credentials: IExpressPayPaypalCommercePlatform | null): void {
    paypalState.ppcpGoogleCredentials = credentials;
}

export function getPPCPGoogleCredentialsChecked(): IExpressPayPaypalCommercePlatform {
    if (!paypalState.ppcpGoogleCredentials) {
        throw new PaypalNullStateKeyError('Precondition violated: ppcpGoogleCredentials is null');
    }
    return paypalState.ppcpGoogleCredentials;
}