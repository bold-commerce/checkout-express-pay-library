import {
    getPaypalButton,
    getPaypalNameSpace,
    hasPaypalButton,
    hasPaypalNameSpace,
    paypalState,
    setPaypalButton,
    setPaypalNameSpace
} from 'src';
import {PayPalNamespace} from '@paypal/paypal-js';
import {PayPalButtonsComponent} from '@paypal/paypal-js/types/components/buttons';

const paypalMock: PayPalNamespace = {version: 'test'};
const buttonMock: PayPalButtonsComponent = {close: jest.fn(), isEligible: jest.fn(), render: jest.fn()};

describe('testing  managePaypalState functions', () => {
    describe('testing  paypalState.paypal sets and gets', () => {

        test('testing call setPaypalNameSpace with mock', async () => {
            paypalState.paypal = null;
            setPaypalNameSpace(paypalMock);
            expect(paypalState.paypal).toBe(paypalMock);
        });

        test('testing call setPaypalNameSpace with null', async () => {
            paypalState.paypal = paypalMock;
            setPaypalNameSpace(null);
            expect(paypalState.paypal).toBe(null);
        });

        test('testing call getPaypalNameSpace with mock', async () => {
            paypalState.paypal = paypalMock;
            expect(getPaypalNameSpace()).toBe(paypalMock);
        });

        test('testing call getPaypalNameSpace with null', async () => {
            paypalState.paypal = null;
            expect(getPaypalNameSpace()).toBe(null);
        });

        test('testing call hasPaypalNameSpace true', async () => {
            paypalState.paypal = paypalMock;
            expect(hasPaypalNameSpace()).toBe(true);
        });

        test('testing call hasPaypalNameSpace false', async () => {
            paypalState.paypal = null;
            expect(hasPaypalNameSpace()).toBe(false);
        });

    });

    describe('testing  paypalState.button sets and gets', () => {

        test('testing call setPaypalButton with mock', async () => {
            paypalState.button = null;
            setPaypalButton(buttonMock);
            expect(paypalState.button).toBe(buttonMock);
        });

        test('testing call setPaypalButton with null', async () => {
            paypalState.button = buttonMock;
            setPaypalButton(null);
            expect(paypalState.button).toBe(null);
        });

        test('testing call getPaypalButton with mock', async () => {
            paypalState.button = buttonMock;
            expect(getPaypalButton()).toBe(buttonMock);
        });

        test('testing call getPaypalButton with null', async () => {
            paypalState.button = null;
            expect(getPaypalButton()).toBe(null);
        });

        test('testing call hasPaypalButton true', async () => {
            paypalState.button = buttonMock;
            expect(hasPaypalButton()).toBe(true);
        });

        test('testing call hasPaypalButton false', async () => {
            paypalState.button = null;
            expect(hasPaypalButton()).toBe(false);
        });

    });
});
