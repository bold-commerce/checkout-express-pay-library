import {mocked} from 'jest-mock';
import {
    braintreeOnLoadGoogle,
    createBraintreeGoogle,
    getBraintreeClient,
    getBraintreeGoogleCredentialsChecked, GooglePayLoadingError,
    hasBraintreeClient,
    IBraintreeClient,
    setBraintreeGooglePayClient,
    setBraintreeGooglePayInstance
} from 'src';
import {getOrderInitialData, IExpressPayBraintreeGoogle} from '@boldcommerce/checkout-frontend-library';
import {orderInitialDataMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getOrderInitialData');
jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/braintree/google/createBraintreeGoogle');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/');
const getBraintreeGoogleCredentialsCheckedMock = mocked(getBraintreeGoogleCredentialsChecked, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const setBraintreeGooglePayClientMock = mocked(setBraintreeGooglePayClient, true);
const setBraintreeGooglePayInstanceMock = mocked(setBraintreeGooglePayInstance, true);
const hasBraintreeMock = mocked(hasBraintreeClient, true);
const getBraintreeMock = mocked(getBraintreeClient, true);
const createBraintreeGoogleMock = mocked(createBraintreeGoogle, true);

describe('testing braintreeOnLoadGoogle function',() => {
    const google = {
        payments: {
            api: {
                PaymentsClient: jest.fn()
            }
        }
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
    });

    test('braintreeOnLoadGoogle - successfully',async () => {
        global.window.google = google;
        getBraintreeGoogleCredentialsCheckedMock.mockReturnValue({
            google_pay_merchant_identifier: 'test id',
            tokenization_key: 'test key',
            is_test: true
        } as IExpressPayBraintreeGoogle);
        getBraintreeMock.mockReturnValue({
            client: {create: jest.fn()},
            googlePayment: {create: jest.fn()},
            applePay: {create: jest.fn()},
        } as IBraintreeClient);
        hasBraintreeMock.mockReturnValueOnce(true);
        await braintreeOnLoadGoogle().then(() => {
            expect(setBraintreeGooglePayClientMock).toBeCalled();
            expect(hasBraintreeMock).toBeCalled();
            expect(getBraintreeMock).toBeCalled();
            expect(setBraintreeGooglePayInstanceMock).toBeCalled();
            expect(createBraintreeGoogleMock).toBeCalled();
        });
    });

    test('braintreeOnLoadGoogle - hasBraintree false',async () => {
        global.window.google = google;
        getBraintreeGoogleCredentialsCheckedMock.mockReturnValue({
            tokenization_key: 'test key',
            is_test: false
        } as IExpressPayBraintreeGoogle);
        hasBraintreeMock.mockReturnValueOnce(false);
        await braintreeOnLoadGoogle().then(() => {
            expect(setBraintreeGooglePayClientMock).toBeCalled();
            expect(hasBraintreeMock).toBeCalled();
            expect(getBraintreeMock).toHaveBeenCalledTimes(0);
            expect(setBraintreeGooglePayInstanceMock).toHaveBeenCalledTimes(0);
            expect(createBraintreeGoogleMock).toHaveBeenCalledTimes(0);
        });
    });

    test('braintreeOnLoadGoogle - with google variable',async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.window.google = undefined;
        getBraintreeGoogleCredentialsCheckedMock.mockReturnValue({
            google_pay_merchant_identifier: 'test id',
            tokenization_key: 'test key',
            is_test: true
        } as IExpressPayBraintreeGoogle);
        hasBraintreeMock.mockReturnValueOnce(false);
        await braintreeOnLoadGoogle().then(() => {
            expect(setBraintreeGooglePayClientMock).toHaveBeenCalledTimes(0);
            expect(hasBraintreeMock).toHaveBeenCalledTimes(0);
            expect(getBraintreeMock).toHaveBeenCalledTimes(0);
            expect(setBraintreeGooglePayInstanceMock).toHaveBeenCalledTimes(0);
            expect(createBraintreeGoogleMock).toHaveBeenCalledTimes(0);
        });
    });

    test('braintreeOnLoadGoogle - throw error as string',async () => {
        global.window.google = google;
        const expectedError = new GooglePayLoadingError('Error loading Google Pay: error');
        getBraintreeGoogleCredentialsCheckedMock.mockReturnValue({
            google_pay_merchant_identifier: 'test id',
            tokenization_key: 'test key',
            is_test: true
        } as IExpressPayBraintreeGoogle);
        createBraintreeGoogleMock.mockImplementation(() => {
            throw 'error';
        });
        hasBraintreeMock.mockReturnValueOnce(true);
        await braintreeOnLoadGoogle().then(() => {
            expect('This expect should not run, call should Throw').toBe(null);
        }).catch((e) => {
            expect(e.message).toBe(expectedError.message);
            expect(e.name).toBe(expectedError.name);
        });
    });

    test('braintreeOnLoadGoogle - throw error as Error',async () => {
        global.window.google = google;
        const expectedError = new GooglePayLoadingError('error');
        getBraintreeGoogleCredentialsCheckedMock.mockReturnValue({
            google_pay_merchant_identifier: 'test id',
            tokenization_key: 'test key',
            is_test: true
        } as IExpressPayBraintreeGoogle);
        createBraintreeGoogleMock.mockImplementation(() => {
            throw new Error('error');
        });
        hasBraintreeMock.mockReturnValueOnce(true);
        await braintreeOnLoadGoogle().then(() => {
            expect('This expect should not run, call should Throw').toBe(null);
        }).catch((e) => {
            expect(e.message).toBe(expectedError.message);
            expect(e.name).toBe(expectedError.name);
        });
    });

});
