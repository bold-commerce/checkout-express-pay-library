import {IExpressPayPaypalCommercePlatform} from '@boldcommerce/checkout-frontend-library';
import {PayPalNamespace} from '@paypal/paypal-js';
import {
    PaypalNullStateKeyError,
    IPaypalNamespaceApple,
    IPPCPAppleConfig,
    IPPCPApplePayInstance,
    paypalState
} from 'src';

export function setPaypalNameSpace(paypal: PayPalNamespace | IPaypalNamespaceApple | null): void {
    paypalState.paypal = paypal;
}

export function setPaypalNameSpacePromise(paypal: Promise<PayPalNamespace | null> | null): void {
    paypalState.paypalPromise = paypal;
}

export function getPaypalNameSpacePromise(): Promise<PayPalNamespace | null> | null {
    return paypalState.paypalPromise;
}

export function getPaypalNameSpace(): PayPalNamespace | IPaypalNamespaceApple | null {
    return paypalState.paypal;
}

export function hasPaypalNameSpace(): boolean {
    return !!paypalState.paypal;
}

export function hasPaypalNameSpaceApple(): boolean {
    const paypal = paypalState.paypal as IPaypalNamespaceApple;
    return !!paypal && !!paypal.Applepay;
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
