import {
    API_RETRY,
    applePayConstants,
    ppcpOnPaymentAuthorizedApple,
    callBillingAddressEndpoint,
    callGuestCustomerEndpoint,
    callShippingAddressEndpoint,
    formatApplePayContactToCheckoutAddress,
    getPPCPAppleCredentialsChecked,
    getPPCPApplePayInstanceChecked,
    getPPCPApplePaySessionChecked,
    IPPCPApplePayInstance,
    orderProcessing,
} from 'src';
import {mocked} from 'jest-mock';
import {
    addPayment,
    baseReturnObject,
    getApplicationState,
    getCurrency,
    IAddPaymentRequest,
    IApiReturnObject,
    IExpressPayPaypalCommercePlatform,
    IFetchError,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import {
    applicationStateMock,
    currencyMock,
    addressesMock
} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;
import ApplePayPaymentAuthorizedEvent = ApplePayJS.ApplePayPaymentAuthorizedEvent;

jest.mock('src/actions/orderProcessing');
jest.mock('src/paypal/managePaypalState');
jest.mock('src/utils/callGuestCustomerEndpoint');
jest.mock('src/utils/callShippingAddressEndpoint');
jest.mock('src/utils/callBillingAddressEndpoint');
jest.mock('src/utils/formatApplePayContactToCheckoutAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/payment/addPayment');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getApplicationState');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes/setTaxes');
const orderProcessingMock = mocked(orderProcessing, true);
const getPPCPApplePayInstanceCheckedMock = mocked(getPPCPApplePayInstanceChecked, true);
const getPPCPApplePaySessionCheckedMock = mocked(getPPCPApplePaySessionChecked, true);
const getPPCPAppleCredentialsCheckedMock = mocked(getPPCPAppleCredentialsChecked, true);
const formatApplePayContactToCheckoutAddressMock = mocked(formatApplePayContactToCheckoutAddress, true);
const callGuestCustomerEndpointMock = mocked(callGuestCustomerEndpoint, true);
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);
const callBillingAddressEndpointMock = mocked(callBillingAddressEndpoint, true);
const addPaymentMock = mocked(addPayment, true);
const getCurrencyMock = mocked(getCurrency, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const setTaxesMock = mocked(setTaxes, true);

describe('testing ppcpOnPaymentAuthorizedApple function', () => {
    const paymentToken = 'tokenized_by_ppcp_apple_pay';
    const credentials = {public_id: 'test_gw_public_id'} as IExpressPayPaypalCommercePlatform;
    const addressContact: ApplePayPaymentContact = {
        givenName: 'John',
        familyName: 'Doe',
        phoneNumber: '1231231234',
        postalCode: 'R3Y0L6',
        locality: 'Winnipeg',
        addressLines: ['123 Any St', 'Line 2'],
        emailAddress: 'test@test.com',
        countryCode: 'CA',
        administrativeArea: 'MB'
    };
    const diffAddressContact = {
        ...addressContact,
        givenName: 'Jane',
        phoneNumber: '3453453456',
        addressLines: ['456 Any St', 'Line 2']
    };
    const event = {
        payment: {
            token: {
                paymentMethod: {
                    network: 'someNetwork',
                    displayName: 'someNetwork 1111'
                }
            },
            shippingContact: addressContact,
            billingContact: diffAddressContact,
        }
    } as unknown as ApplePayPaymentAuthorizedEvent;
    const successReturn = {...baseReturnObject, success: true};
    const successPaymentReturn = {
        ...baseReturnObject,
        success: true,
        response: {
            data: {
                payment: {
                    token: 'PaypalOrderId'
                }
            }
        }
    } as IApiReturnObject;
    const applePaySessionMock = {STATUS_SUCCESS: 1, STATUS_FAILURE: 2};
    const config = jest.fn();
    const validateMerchant = jest.fn();
    const confirmOrder = jest.fn();
    const applePaySessionBegin = jest.fn();
    const applePaySessionCompletePayment = jest.fn();
    const applePaySessionObj = {
        begin: applePaySessionBegin,
        completePayment: applePaySessionCompletePayment
    } as unknown as ApplePaySession;
    const appleInstance: IPPCPApplePayInstance = {config, validateMerchant, confirmOrder};

    beforeEach(() => {
        jest.resetAllMocks();
        getPPCPApplePayInstanceCheckedMock.mockReturnValue(appleInstance);
        getPPCPApplePaySessionCheckedMock.mockReturnValue(applePaySessionObj);
        formatApplePayContactToCheckoutAddressMock.mockReturnValue(addressesMock.shipping);
        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve(successReturn));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve(successReturn));
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve(successReturn));
        setTaxesMock.mockReturnValue(Promise.resolve(successReturn));
        getPPCPAppleCredentialsCheckedMock.mockReturnValueOnce(credentials);
        getCurrencyMock.mockReturnValue(currencyMock);
        getApplicationStateMock.mockReturnValue(applicationStateMock);
        addPaymentMock.mockReturnValue(Promise.resolve(successPaymentReturn));
        global.window.ApplePaySession = applePaySessionMock;
    });

    const happyPathData = [
        {
            n: 'called successfully with different addresses',
            shipping: addressesMock.shipping,
            billing: addressesMock.billing,
            givenName: addressContact.givenName,
            familyName: addressContact.familyName,
            emailAddress: addressContact.emailAddress,
            notSame: true,
            eventParam: event
        },
        {
            n: 'called successfully with same addresses',
            shipping: addressesMock.shipping,
            billing: addressesMock.shipping,
            givenName: addressContact.givenName,
            familyName: addressContact.familyName,
            emailAddress: addressContact.emailAddress,
            notSame: false,
            eventParam: {...event, payment: {...event.payment, billingContact: addressContact}}
        },
        {
            n: 'called successfully without shippingContact',
            shipping: addressesMock.shipping,
            billing: addressesMock.billing,
            givenName: '',
            familyName: '',
            emailAddress: '',
            notSame: true,
            eventParam: {...event, payment: {...event.payment, shippingContact: undefined}}
        },
    ];

    test.each(happyPathData)('$n', async (
        {
            shipping,
            billing,
            givenName,
            familyName,
            emailAddress,
            notSame,
            eventParam }
    ) => {
        formatApplePayContactToCheckoutAddressMock
            .mockReturnValueOnce(shipping)
            .mockReturnValueOnce(billing);
        const expectedPayment = {
            token: paymentToken,
            gateway_public_id: credentials.public_id,
            currency: currencyMock.iso_code,
            amount: applicationStateMock.order_total,
            extra_payment_data: {
                brand: eventParam.payment.token.paymentMethod.network,
                last_digits: '1111',
                paymentSource: 'apple_pay',
                language: 'en-US'
            }
        } as IAddPaymentRequest;

        await ppcpOnPaymentAuthorizedApple(eventParam as ApplePayPaymentAuthorizedEvent);

        expect(getPPCPApplePayInstanceCheckedMock).toBeCalledTimes(1);
        expect(getPPCPApplePaySessionCheckedMock).toBeCalledTimes(1);
        expect(formatApplePayContactToCheckoutAddressMock).toBeCalledTimes(2);
        expect(formatApplePayContactToCheckoutAddressMock).toBeCalledWith(eventParam.payment.shippingContact);
        expect(formatApplePayContactToCheckoutAddressMock).toBeCalledWith(eventParam.payment.billingContact);
        expect(callGuestCustomerEndpointMock).toBeCalledTimes(1);
        expect(callGuestCustomerEndpointMock).toBeCalledWith(givenName, familyName, emailAddress);
        expect(callShippingAddressEndpointMock).toBeCalledTimes(1);
        expect(callShippingAddressEndpointMock).toBeCalledWith(shipping, false);
        expect(callBillingAddressEndpointMock).toBeCalledTimes(1);
        expect(callBillingAddressEndpointMock).toBeCalledWith(billing, notSame);
        expect(setTaxesMock).toBeCalledTimes(1);
        expect(setTaxesMock).toBeCalledWith(API_RETRY);
        expect(getPPCPAppleCredentialsCheckedMock).toBeCalledTimes(1);
        expect(getCurrencyMock).toBeCalledTimes(1);
        expect(getApplicationStateMock).toBeCalledTimes(1);
        expect(addPaymentMock).toBeCalledTimes(1);
        expect(addPaymentMock).toBeCalledWith(expectedPayment, API_RETRY);
        expect(confirmOrder).toBeCalledTimes(1);
        expect(confirmOrder).toBeCalledWith({
            orderId: 'PaypalOrderId',
            token: eventParam.payment.token,
            shippingContact: eventParam.payment.shippingContact,
            billingContact: eventParam.payment.billingContact
        });
        expect(applePaySessionCompletePayment).toBeCalledTimes(1);
        expect(applePaySessionCompletePayment).toBeCalledWith(applePaySessionMock.STATUS_SUCCESS);
        expect(orderProcessingMock).toBeCalledTimes(1);
    });

    const errorMsg = 'Error Test!';
    const customerErrorMsg = 'There was an unknown error while validating your customer information.';
    const shippingErrorMsg = 'There was an unknown error while validating your shipping address.';
    const billingErrorMsg = 'There was an unknown error while validating your billing address.';
    const taxesErrorMsg = 'There was an unknown error while calculating the taxes.';
    const paymentErrorMsg = 'There was an unknown error while processing your payment.';
    const genericError = new Error(errorMsg) as IFetchError;
    const failureReturnNoError = {...baseReturnObject, success: false};
    const failureReturnWithError = {...baseReturnObject, success: false, error: genericError};

    const failureData = [
        {
            n: 'called failed customer response with error',
            customerResp: failureReturnWithError,
            shippingResp: successReturn,
            billingResp: successReturn,
            taxesResp: successReturn,
            paymentResp: successReturn,
            error: {code: applePayConstants.APPLEPAY_ERROR_CODE_SHIPPING_CONTACT, message: errorMsg}
        },
        {
            n: 'called failed customer response without error',
            customerResp: failureReturnNoError,
            shippingResp: successReturn,
            billingResp: successReturn,
            taxesResp: successReturn,
            paymentResp: successReturn,
            error: {code: applePayConstants.APPLEPAY_ERROR_CODE_SHIPPING_CONTACT, message: customerErrorMsg}
        },
        {
            n: 'called failed shipping response with error',
            customerResp: successReturn,
            shippingResp: failureReturnWithError,
            billingResp: successReturn,
            taxesResp: successReturn,
            paymentResp: successReturn,
            error: {code: applePayConstants.APPLEPAY_ERROR_CODE_SHIPPING_CONTACT, message: errorMsg}
        },
        {
            n: 'called failed shipping response without error',
            customerResp: successReturn,
            shippingResp: failureReturnNoError,
            billingResp: successReturn,
            taxesResp: successReturn,
            paymentResp: successReturn,
            error: {code: applePayConstants.APPLEPAY_ERROR_CODE_SHIPPING_CONTACT, message: shippingErrorMsg}
        },
        {
            n: 'called failed billing response with error',
            customerResp: successReturn,
            shippingResp: successReturn,
            billingResp: failureReturnWithError,
            taxesResp: successReturn,
            paymentResp: successReturn,
            error: {code: applePayConstants.APPLEPAY_ERROR_CODE_BILLING_CONTACT, message: errorMsg}
        },
        {
            n: 'called failed billing response without error',
            customerResp: successReturn,
            shippingResp: successReturn,
            billingResp: failureReturnNoError,
            taxesResp: successReturn,
            paymentResp: successReturn,
            error: {code: applePayConstants.APPLEPAY_ERROR_CODE_BILLING_CONTACT, message: billingErrorMsg}
        },
        {
            n: 'called failed taxes response with error',
            customerResp: successReturn,
            shippingResp: successReturn,
            billingResp: successReturn,
            taxesResp: failureReturnWithError,
            paymentResp: successReturn,
            error: {code: applePayConstants.APPLEPAY_ERROR_CODE_UNKNOWN, message: errorMsg}
        },
        {
            n: 'called failed taxes response without error',
            customerResp: successReturn,
            shippingResp: successReturn,
            billingResp: successReturn,
            taxesResp: failureReturnNoError,
            paymentResp: successReturn,
            error: {code: applePayConstants.APPLEPAY_ERROR_CODE_UNKNOWN, message: taxesErrorMsg}
        },
        {
            n: 'called failed payment response with error',
            customerResp: successReturn,
            shippingResp: successReturn,
            billingResp: successReturn,
            taxesResp: successReturn,
            paymentResp: failureReturnWithError,
            error: {code: applePayConstants.APPLEPAY_ERROR_CODE_UNKNOWN, message: errorMsg}
        },
        {
            n: 'called failed payment response without error',
            customerResp: successReturn,
            shippingResp: successReturn,
            billingResp: successReturn,
            taxesResp: successReturn,
            paymentResp: failureReturnNoError,
            error: {code: applePayConstants.APPLEPAY_ERROR_CODE_UNKNOWN, message: paymentErrorMsg}
        },
    ];

    test.each(failureData)('$n', async ({customerResp, shippingResp, billingResp, taxesResp, paymentResp, error}) => {
        callGuestCustomerEndpointMock.mockReturnValueOnce(Promise.resolve(customerResp));
        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(shippingResp));
        callBillingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(billingResp));
        setTaxesMock.mockReturnValueOnce(Promise.resolve(taxesResp));
        addPaymentMock.mockReturnValueOnce(Promise.resolve(paymentResp));
        const completePaymentParam = {
            status: applePaySessionMock.STATUS_FAILURE,
            errors: [error]
        };

        await ppcpOnPaymentAuthorizedApple(event);
        expect(orderProcessingMock).toBeCalledTimes(0);
        expect(applePaySessionCompletePayment).toBeCalledTimes(1);
        expect(applePaySessionCompletePayment).toHaveBeenCalledWith(completePaymentParam);
    });

    const errorData = [
        {n: 'call with tokenize throwing Error', error: genericError, message: errorMsg},
        {n: 'call with tokenize throwing Error with no message', error: new Error(), message: ''},
        {n: 'call with tokenize throwing string', error: errorMsg, message: errorMsg},
        {n: 'call with tokenize throwing string', error: undefined, message: 'There was an unknown error while processing your payment.'}
    ];

    test.each(errorData)('$n', async ({error, message}) => {
        confirmOrder.mockImplementationOnce(() => {
            throw error;
        });
        const completePaymentParam = {
            status: applePaySessionMock.STATUS_FAILURE,
            errors: [{code: applePayConstants.APPLEPAY_ERROR_CODE_UNKNOWN, message}]
        };

        await ppcpOnPaymentAuthorizedApple(event);
        expect(applePaySessionCompletePayment).toBeCalledTimes(1);
        expect(applePaySessionCompletePayment).toHaveBeenCalledWith(completePaymentParam);
        expect(orderProcessingMock).toBeCalledTimes(0);
    });
});
