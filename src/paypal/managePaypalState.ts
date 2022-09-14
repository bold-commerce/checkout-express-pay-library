import {PayPalNamespace} from '@paypal/paypal-js';
import {paypalState} from 'src';
import {PayPalButtonsComponent} from '@paypal/paypal-js/types/components/buttons';

export function setPaypalNameSpace(paypal: PayPalNamespace | null): void {
    paypalState.paypal = paypal;
}

export function getPaypalNameSpace(): PayPalNamespace | null {
    return paypalState.paypal;
}

export function hasPaypalNameSpace(): boolean {
    return !!paypalState.paypal;
}

export function setPaypalButton(button: PayPalButtonsComponent | null): void {
    paypalState.button = button;
}

export function getPaypalButton(): PayPalButtonsComponent | null {
    return paypalState.button;
}

export function hasPaypalButton(): boolean {
    return !!paypalState.button;
}
