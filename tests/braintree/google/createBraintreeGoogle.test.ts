import {
    braintreeCreatePaymentRequestGoogle, braintreeOnClickGoogle,
    createBraintreeGoogle, enableDisableSection,
    getBraintreeGooglePayClientChecked,
    getBraintreeGooglePayInstanceChecked,
    IBraintreeGooglePayInstance, showPaymentMethodTypes
} from 'src';
import {mocked} from 'jest-mock';
import PaymentsClient = google.payments.api.PaymentsClient;
import PaymentDataRequest = google.payments.api.PaymentDataRequest;

jest.mock('src/actions/enableDisableSection');
jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/braintree/google/braintreeCreatePaymentRequestGoogle');
const enableDisableSectionMock = mocked(enableDisableSection, true);
const braintreeCreatePaymentRequestGoogleMock = mocked(braintreeCreatePaymentRequestGoogle, true);
const getBraintreeGooglePayInstanceCheckedMock = mocked(getBraintreeGooglePayInstanceChecked, true);
const getBraintreeGooglePayClientCheckedMock = mocked(getBraintreeGooglePayClientChecked, true);

describe('testing createBraintreeGoogle function', () => {
    const createPaymentDataRequest = jest.fn();
    const isReadyToPay = jest.fn();
    const createButton = jest.fn();
    const prefetchPaymentData = jest.fn();
    const googlePayInstance = {createPaymentDataRequest} as unknown as IBraintreeGooglePayInstance;
    const googlePayClient = {isReadyToPay, createButton, prefetchPaymentData} as unknown as PaymentsClient;
    const allowedPaymentMethods = [{type: 'CARD'}, {type: 'PAYPAL'}];
    const allowedPaymentMethodsFiltered = [{type: 'CARD'}];
    const expectedCreateButtonParam = {
        onClick: braintreeOnClickGoogle,
        buttonType: 'short',
        buttonSizeMode: 'fill',
        allowedPaymentMethods: allowedPaymentMethodsFiltered
    };
    const expectedIsReadyToPayParam = {apiVersion: 2, apiVersionMinor: 0, allowedPaymentMethods: allowedPaymentMethodsFiltered};
    const paymentRequestMock = {allowedPaymentMethods} as PaymentDataRequest;
    const expressContainer = document.createElement('div');
    const braintreeDiv = document.createElement('div');
    const button = document.createElement('button');

    beforeEach(() => {
        jest.resetAllMocks();
        document.body.innerHTML = '';
        expressContainer.id = 'express-payment-container';
        expressContainer.innerHTML = '';
        braintreeDiv.id = 'braintree-google-express-payment';
        braintreeDiv.style.display = '';
        braintreeDiv.innerHTML = '';
        button.id = '';
        button.className = '';
        getBraintreeGooglePayClientCheckedMock.mockReturnValue(googlePayClient);
        getBraintreeGooglePayInstanceCheckedMock.mockReturnValue(googlePayInstance);
        createPaymentDataRequest.mockReturnValue(paymentRequestMock);
        braintreeCreatePaymentRequestGoogleMock.mockReturnValue(paymentRequestMock);
        isReadyToPay.mockReturnValue({result: true});
        createButton.mockReturnValue(button);
    });

    test('call mounted successfully',  async () => {
        document.body.appendChild(expressContainer);

        await createBraintreeGoogle();

        expect(getBraintreeGooglePayClientCheckedMock).toBeCalledTimes(1);
        expect(getBraintreeGooglePayInstanceCheckedMock).toBeCalledTimes(1);
        expect(createPaymentDataRequest).toBeCalledTimes(1);
        expect(isReadyToPay).toBeCalledTimes(1);
        expect(isReadyToPay).toBeCalledWith(expectedIsReadyToPayParam);
        expect(createButton).toBeCalledTimes(1);
        expect(createButton).toBeCalledWith(expectedCreateButtonParam);
        expect(braintreeCreatePaymentRequestGoogleMock).toBeCalledTimes(1);
        expect(prefetchPaymentData).toBeCalledTimes(1);
        expect(prefetchPaymentData).toBeCalledWith(paymentRequestMock);
        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.BRAINTREE_GOOGLE, true);
        expect(document.getElementById('braintree-google-express-payment')).not.toBeNull();
        expect(document.getElementById('braintree-google-pay-button')).not.toBeNull();
    });

    test('call isReadyToPay false',  async () => {
        isReadyToPay.mockReturnValueOnce({result: false});

        await createBraintreeGoogle();

        expect(getBraintreeGooglePayClientCheckedMock).toBeCalledTimes(1);
        expect(getBraintreeGooglePayInstanceCheckedMock).toBeCalledTimes(1);
        expect(createPaymentDataRequest).toBeCalledTimes(1);
        expect(isReadyToPay).toBeCalledTimes(1);
        expect(createButton).toBeCalledTimes(0);
        expect(braintreeCreatePaymentRequestGoogleMock).toBeCalledTimes(0);
        expect(prefetchPaymentData).toBeCalledTimes(0);
        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.BRAINTREE_GOOGLE, false);
        expect(document.getElementById('braintree-google-express-payment')).toBeNull();
        expect(document.getElementById('braintree-google-pay-button')).toBeNull();
    });

    test('call pre mounthed and isReadyToPay false',  async () => {
        expressContainer.appendChild(braintreeDiv);
        document.body.appendChild(expressContainer);
        isReadyToPay.mockReturnValueOnce({result: false});

        await createBraintreeGoogle();

        expect(getBraintreeGooglePayClientCheckedMock).toBeCalledTimes(1);
        expect(getBraintreeGooglePayInstanceCheckedMock).toBeCalledTimes(1);
        expect(createPaymentDataRequest).toBeCalledTimes(1);
        expect(isReadyToPay).toBeCalledTimes(1);
        expect(createButton).toBeCalledTimes(0);
        expect(braintreeCreatePaymentRequestGoogleMock).toBeCalledTimes(0);
        expect(prefetchPaymentData).toBeCalledTimes(0);
        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.BRAINTREE_GOOGLE, false);
        expect(document.getElementById('braintree-google-express-payment')).not.toBeNull();
        expect(document.getElementById('braintree-google-express-payment')?.style.display).toBe('none');
        expect(document.getElementById('braintree-google-pay-button')).toBeNull();
    });

    test('call pre mounthed',  async () => {
        expressContainer.appendChild(braintreeDiv);
        document.body.appendChild(expressContainer);

        await createBraintreeGoogle();

        expect(getBraintreeGooglePayClientCheckedMock).toBeCalledTimes(1);
        expect(getBraintreeGooglePayInstanceCheckedMock).toBeCalledTimes(1);
        expect(createPaymentDataRequest).toBeCalledTimes(1);
        expect(isReadyToPay).toBeCalledTimes(1);
        expect(createButton).toBeCalledTimes(0);
        expect(braintreeCreatePaymentRequestGoogleMock).toBeCalledTimes(1);
        expect(prefetchPaymentData).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.BRAINTREE_GOOGLE, true);
        expect(document.getElementById('braintree-google-express-payment')).not.toBeNull();
        expect(document.getElementById('braintree-google-pay-button')).toBeNull();
    });

    test('call missing express container',  async () => {
        await createBraintreeGoogle();

        expect(getBraintreeGooglePayClientCheckedMock).toBeCalledTimes(1);
        expect(getBraintreeGooglePayInstanceCheckedMock).toBeCalledTimes(1);
        expect(createPaymentDataRequest).toBeCalledTimes(1);
        expect(isReadyToPay).toBeCalledTimes(1);
        expect(createButton).toBeCalledTimes(1);
        expect(braintreeCreatePaymentRequestGoogleMock).toBeCalledTimes(0);
        expect(prefetchPaymentData).toBeCalledTimes(0);
        expect(enableDisableSectionMock).toBeCalledTimes(1);
        expect(enableDisableSectionMock).toBeCalledWith(showPaymentMethodTypes.BRAINTREE_GOOGLE, false);
        expect(document.getElementById('braintree-google-express-payment')).toBeNull();
        expect(document.getElementById('braintree-google-pay-button')).toBeNull();
    });
});
