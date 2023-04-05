import {mocked} from 'jest-mock';
import {createPPCPApple, enableDisableSection, showPaymentMethodTypes} from 'src';

jest.mock('src/actions/enableDisableSection');
//jest.mock('src/paypal/ppcp_apple/ppcpOnClickApple');
const enableDisableSectionMock = mocked(enableDisableSection, true);
//const braintreeOnClickAppleMock = mocked(ppcpOnClickApple, true);

describe('testing createBraintreeApple function',() => {
    const container = document.createElement('div');
    const ppcpAppleDiv = document.createElement('div');

    beforeEach(() => {
        jest.resetAllMocks();
        document.body.innerHTML = '';
        container.id = 'express-payment-container';
        container.innerHTML = '';
        ppcpAppleDiv.id = 'ppcp-apple-express-payment';
        ppcpAppleDiv.innerHTML = '';
    });

    test('call mounted successfully',() => {
        document.body.appendChild(container);

        createPPCPApple();

        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.PPCP_APPLE, true);
        expect(document.getElementById('ppcp-apple-express-payment')).not.toBeNull();
        expect(document.getElementById('ppcp-apple-pay-button')).not.toBeNull();
        document.getElementById('ppcp-apple-pay-button')?.click();
        //expect(braintreeOnClickAppleMock).toBeCalledTimes(1);
    });

    test('call pre mounted',async () => {
        container.appendChild(ppcpAppleDiv);
        document.body.appendChild(container);

        createPPCPApple();

        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.PPCP_APPLE, true);
        expect(document.getElementById('ppcp-apple-express-payment')).not.toBeNull();
        expect(document.getElementById('ppcp-apple-pay-button')).toBeNull();
    });

    test('call missing container',async () => {
        createPPCPApple();

        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.PPCP_APPLE, false);
        expect(document.getElementById('ppcp-apple-express-payment')).toBeNull();
        expect(document.getElementById('ppcp-apple-pay-button')).toBeNull();
    });
});
