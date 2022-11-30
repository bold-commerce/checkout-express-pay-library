import {PayPalNamespace} from '@paypal/paypal-js';
import {paypalState} from 'src';

export function setPaypalNameSpace(paypal: PayPalNamespace | null): void {
    paypalState.paypal = paypal;
}

export function getPaypalNameSpace(): PayPalNamespace | null {
    return paypalState.paypal;
}

export function hasPaypalNameSpace(): boolean {
    return !!paypalState.paypal;
}

export function setPaypalGatewayPublicId(gatewayPublicId: string): void {
    paypalState.gatewayPublicId = gatewayPublicId;
}

export function getPaypalGatewayPublicId(): string {
    return paypalState.gatewayPublicId;
}
