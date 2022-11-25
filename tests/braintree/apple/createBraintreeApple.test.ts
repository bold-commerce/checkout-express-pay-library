import {mocked} from 'jest-mock';
import {braintreeOnClickApple, createBraintreeApple, enableDisableSection, showPaymentMethodTypes} from 'src';

jest.mock('src/actions/enableDisableSection');
jest.mock('src/braintree/apple/braintreeOnClickApple');
const enableDisableSectionMock = mocked(enableDisableSection, true);
const braintreeOnClickAppleMock = mocked(braintreeOnClickApple, true);

describe('testing createBraintreeApple function',() => {
    const container = document.createElement('div');
    const braintreeDiv = document.createElement('div');

    beforeEach(() => {
        jest.resetAllMocks();
        document.body.innerHTML = '';
        container.id = 'express-payment-container';
        container.innerHTML = '';
        braintreeDiv.id = 'braintree-apple-express-payment';
        braintreeDiv.innerHTML = '';
    });

    test('call mounted successfully',() => {
        document.body.appendChild(container);

        createBraintreeApple();

        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.BRAINTREE_APPLE, true);
        expect(document.getElementById('braintree-apple-express-payment')).not.toBeNull();
        expect(document.getElementById('braintree-apple-pay-button')).not.toBeNull();
        document.getElementById('braintree-apple-pay-button')?.click();
        expect(braintreeOnClickAppleMock).toBeCalledTimes(1);
    });

    test('call pre mounted',async () => {
        container.appendChild(braintreeDiv);
        document.body.appendChild(container);

        createBraintreeApple();

        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.BRAINTREE_APPLE, true);
        expect(document.getElementById('braintree-apple-express-payment')).not.toBeNull();
        expect(document.getElementById('braintree-apple-pay-button')).toBeNull();
    });

    test('call missing container',async () => {
        createBraintreeApple();

        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.BRAINTREE_APPLE, false);
        expect(document.getElementById('braintree-apple-express-payment')).toBeNull();
        expect(document.getElementById('braintree-apple-pay-button')).toBeNull();
    });
});
