import {
    braintreeOnPaymentAuthorizedGoogle,
    callGuestCustomerEndpoint,
    getBraintreeGooglePayInstanceChecked,
    isObjectEquals,
    callBillingAddressEndpoint,
    callShippingAddressEndpoint,
    getBraintreeGoogleCredentialsChecked, orderProcessing, braintreeConstants
} from 'src';
import {
    addPayment,
    getApplicationState,
    getCurrency,
    getOrderInitialData, IFetchError
} from '@bold-commerce/checkout-frontend-library';
import PaymentData = google.payments.api.PaymentData;
import CardNetwork = google.payments.api.CardNetwork;
import {mocked} from 'jest-mock';
import {baseReturnObject, IExpressPayBraintreeGoogle, setTaxes} from '@bold-commerce/checkout-frontend-library';
import {
    applicationStateMock,
    currencyMock,
    orderInitialDataMock
} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('@bold-commerce/checkout-frontend-library/lib/taxes/setTaxes');
jest.mock('@bold-commerce/checkout-frontend-library/lib/payment/addPayment');
jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/utils/isObjectEquals');
jest.mock('src/utils/callGuestCustomerEndpoint');
jest.mock('src/utils/callShippingAddressEndpoint');
jest.mock('src/utils/callBillingAddressEndpoint');
jest.mock('src/actions/orderProcessing');

const getBraintreeGooglePayInstanceCheckedMock = mocked(getBraintreeGooglePayInstanceChecked, true);
const isObjectEqualsMock = mocked(isObjectEquals, true);
const callGuestCustomerEndpointMock = mocked(callGuestCustomerEndpoint, true);
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);
const callBillingAddressEndpointMock = mocked(callBillingAddressEndpoint, true);
const setTaxesMock = mocked(setTaxes, true);
const getBraintreeGoogleCredentialsCheckedMock = mocked(getBraintreeGoogleCredentialsChecked, true);
const getCurrencyMock = mocked(getCurrency, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const addPaymentMock = mocked(addPayment, true);
const orderProcessingMock = mocked(orderProcessing, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);


describe('testing braintreeOnPaymentAuthorizedGoogle function',() => {

    const successResponse = {...baseReturnObject, success: true};
    const failureResponse = {...baseReturnObject, success: false};
    const failureResponseWithError = {...failureResponse};
    const error = {
        name: 'error name',
        message: 'error',
    };
    failureResponseWithError.error = error as IFetchError;
    const address = {
        name: 'john kris',
        address1: '1234 address',
        address2: 'apt 123',
        locality: 'winnipeg',
        administrativeArea: 'mb',
        countryCode: 'CA',
        postalCode: 'R3M1A1',
        phoneNumber: '123-456-7890'
    };

    const paymentData: PaymentData = {
        apiVersion: 1,
        apiVersionMinor: 1,
        paymentMethodData: {
            type: 'CARD',
            tokenizationData: {
                type: 'PAYMENT_GATEWAY',
                token: 'test'
            },
            info: {
                cardNetwork: {} as CardNetwork,
                cardDetails: 'test',
                billingAddress: address
            },
        },
        email: 'test@gmail.com',
        shippingAddress: address
    };

    const dataset = [
        {
            name: 'callGuestCustomerEndpoint failure without error',
            callGuest: failureResponse,
            callShipping: successResponse,
            callBilling: successResponse,
            callTaxes: successResponse,
            callPayment: successResponse,
            reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_PAYMENT,
            error: 'There was an unknown error while validating your customer information.'
        },
        {
            name: 'callGuestCustomerEndpoint failure with error',
            callGuest: failureResponseWithError,
            callShipping: successResponse,
            callBilling: successResponse,
            callTaxes: successResponse,
            callPayment: successResponse,
            reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_PAYMENT,
            error: 'error'
        },
        {
            name: 'callShippingAddressEndpoint failure without error',
            callGuest: successResponse,
            callShipping: failureResponse,
            callBilling: successResponse,
            callTaxes: successResponse,
            callPayment: successResponse,
            reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_SHIPPING,
            error: 'There was an unknown error while validating your shipping address.'
        },
        {
            name: 'callShippingAddressEndpoint failure with error',
            callGuest: successResponse,
            callShipping: failureResponseWithError,
            callBilling: successResponse,
            callTaxes: successResponse,
            callPayment: successResponse,
            reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_SHIPPING,
            error: 'error'
        },
        {
            name: 'callBillingAddressEndpoint failure without error',
            callGuest: successResponse,
            callShipping: successResponse,
            callBilling: failureResponse,
            callTaxes: successResponse,
            callPayment: successResponse,
            reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_PAYMENT,
            error: 'There was an unknown error while validating your billing address.'
        },
        {
            name: 'callBillingAddressEndpoint failure with error',
            callGuest: successResponse,
            callShipping: successResponse,
            callBilling: failureResponseWithError,
            callTaxes: successResponse,
            callPayment: successResponse,
            reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_PAYMENT,
            error: 'error'
        },
        {
            name: 'setTaxes failure without error',
            callGuest: successResponse,
            callShipping: successResponse,
            callBilling: successResponse,
            callTaxes: failureResponse,
            callPayment: successResponse,
            reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_PAYMENT,
            error: 'There was an unknown error while calculating the taxes.'
        },
        {
            name: 'setTaxes failure with error',
            callGuest: successResponse,
            callShipping: successResponse,
            callBilling: successResponse,
            callTaxes: failureResponseWithError,
            callPayment: successResponse,
            reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_PAYMENT,
            error: 'error'
        },
        {
            name: 'addPayment failure without error',
            callGuest: successResponse,
            callShipping: successResponse,
            callBilling: successResponse,
            callTaxes: successResponse,
            callPayment: failureResponse,
            reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_PAYMENT,
            error: 'There was an unknown error while processing your payment.'
        },
        {
            name: 'addPayment failure with error',
            callGuest: successResponse,
            callShipping: successResponse,
            callBilling: successResponse,
            callTaxes: successResponse,
            callPayment: failureResponseWithError,
            reason: braintreeConstants.GOOGLEPAY_ERROR_REASON_PAYMENT,
            error: 'error'
        }
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        getBraintreeGooglePayInstanceCheckedMock.mockReturnValue({
            createPaymentDataRequest: jest.fn(),
            parseResponse: jest.fn().mockReturnValue({
                nonce: 'test nonce',
                type: 'AndroidPayCard',
                paymentData: {test: 'test value'},
            })
        });
        getBraintreeGoogleCredentialsCheckedMock.mockReturnValue({public_id: 'test Id'} as IExpressPayBraintreeGoogle);
        getApplicationStateMock.mockReturnValue(applicationStateMock);
        getCurrencyMock.mockReturnValue(currencyMock);
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
    });



    test('braintreeOnPaymentAuthorizedGoogle - successfully', async () => {
        isObjectEqualsMock.mockReturnValueOnce(true);
        callGuestCustomerEndpointMock.mockReturnValueOnce(Promise.resolve(successResponse));
        callBillingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(successResponse));

        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(successResponse));
        setTaxesMock.mockReturnValueOnce(Promise.resolve(successResponse));
        addPaymentMock.mockReturnValueOnce(Promise.resolve(successResponse));
        const result = await braintreeOnPaymentAuthorizedGoogle(paymentData);

        expect(orderProcessingMock).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual({transactionState: braintreeConstants.GOOGLEPAY_TRANSACTION_STATE_SUCCESS});
    });

    test('braintreeOnPaymentAuthorizedGoogle - with empty values', async () => {
        const paymentDataLocal = {...paymentData, email: undefined};
        isObjectEqualsMock.mockReturnValueOnce(true);
        callGuestCustomerEndpointMock.mockReturnValueOnce(Promise.resolve(successResponse));
        callBillingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(successResponse));

        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(successResponse));
        setTaxesMock.mockReturnValueOnce(Promise.resolve(successResponse));
        addPaymentMock.mockReturnValueOnce(Promise.resolve(successResponse));
        const result = await braintreeOnPaymentAuthorizedGoogle(paymentDataLocal);

        expect(orderProcessingMock).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual({transactionState: braintreeConstants.GOOGLEPAY_TRANSACTION_STATE_SUCCESS});
    });

    test.each(dataset)('$name', async ({callGuest, callShipping, callBilling, callPayment, callTaxes, reason, error}) => {
        isObjectEqualsMock.mockReturnValueOnce(true);
        callGuestCustomerEndpointMock.mockReturnValueOnce(Promise.resolve(callGuest));
        callBillingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(callBilling));

        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(callShipping));
        setTaxesMock.mockReturnValueOnce(Promise.resolve(callTaxes));
        addPaymentMock.mockReturnValueOnce(Promise.resolve(callPayment));
        const result = await braintreeOnPaymentAuthorizedGoogle(paymentData);

        expect(orderProcessingMock).toHaveBeenCalledTimes(0);
        expect(result).toStrictEqual({
            transactionState: braintreeConstants.GOOGLEPAY_TRANSACTION_STATE_ERROR, error: {
                reason: reason,
                intent: braintreeConstants.GOOGLEPAY_INTENT_PAYMENT_AUTHORIZATION,
                message: error
            }
        });
    });

});
