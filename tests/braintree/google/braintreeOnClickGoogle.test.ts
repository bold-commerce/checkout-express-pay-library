import {
    braintreeCreatePaymentRequestGoogle,
    braintreeOnClickGoogle,
    displayError,
    getBraintreeGooglePayClientChecked
} from 'src';
import {mocked} from 'jest-mock';

jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/braintree/google/braintreeCreatePaymentRequestGoogle');
jest.mock('src/actions/displayError');

const getBraintreeGooglePayClientCheckedMock = mocked(getBraintreeGooglePayClientChecked, true);
const braintreeCreatePaymentRequestGoogleMock = mocked(braintreeCreatePaymentRequestGoogle, true);
const displayErrorMock = mocked(displayError, true);


describe('testing braintreeOnClickGoogle function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('braintreeOnClickGoogle - successfully', async () => {
        const googlePayClient = {
            loadPaymentData: jest.fn(),
            isReadyToPay: jest.fn(),
            createButton:jest.fn(),
            prefetchPaymentData: jest.fn()
        };

        getBraintreeGooglePayClientCheckedMock.mockReturnValueOnce(googlePayClient);

        await braintreeOnClickGoogle();
        expect(googlePayClient.loadPaymentData).toBeCalled();
        expect(braintreeCreatePaymentRequestGoogleMock).toBeCalled();
        expect(displayErrorMock).not.toBeCalled();
    });

    test('braintreeOnClickGoogle - failure', async () => {
        const googlePayClient = {
            loadPaymentData: jest.fn().mockImplementation(() => {
                throw 'test error';
            }),
            isReadyToPay: jest.fn(),
            createButton:jest.fn(),
            prefetchPaymentData: jest.fn()
        };

        getBraintreeGooglePayClientCheckedMock.mockReturnValueOnce(googlePayClient);

        await braintreeOnClickGoogle();
        expect(googlePayClient.loadPaymentData).toBeCalled();
        expect(braintreeCreatePaymentRequestGoogleMock).toBeCalled();
        expect(displayErrorMock).toBeCalled();
        expect(displayErrorMock).toHaveBeenCalledWith('There was an unknown error while loading the wallet pay', 'generic', 'unknown_error');
    });
});
