import {IExpressPayPaypalCommercePlatform} from '@bold-commerce/checkout-frontend-library';
import {PayPalNamespace} from '@paypal/paypal-js';
import {IPaypalNamespaceApple, IPPCPApplePayInstance, paypalState} from 'src';

export function setPaypalNameSpace(paypal: PayPalNamespace | IPaypalNamespaceApple | null): void {
    paypalState.paypal = paypal;
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

export function setPaypalGatewayPublicId(gatewayPublicId: string): void {
    paypalState.gatewayPublicId = gatewayPublicId;
}

export function getPaypalGatewayPublicId(): string {
    return paypalState.gatewayPublicId;
}

export function setPPCPAppleCredentials(credentials: IExpressPayPaypalCommercePlatform | null): void {
    paypalState.ppcpAppleCredentials = credentials;
}
