import {
    braintreeCreatePaymentRequestGoogle,
    getBraintreeGoogleCredentialsChecked,
    getBraintreeGooglePayInstanceChecked,
    getBraintreeShippingOptionsGoogle,
    IBraintreeGooglePayInstance
} from 'src';
import mocked = jest.mocked;
import {getApplicationState, getCurrency, getOrderInitialData} from '@bold-commerce/checkout-frontend-library';
import {
    applicationStateMock,
    currencyMock,
    orderInitialDataMock
} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import ShippingOptionParameters = google.payments.api.ShippingOptionParameters;

jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/braintree/google/getBraintreeShippingOptionsGoogle');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/');
const getBraintreeGooglePayInstanceCheckedMock = mocked(getBraintreeGooglePayInstanceChecked, true);
const getBraintreeGoogleCredentialsCheckedMock = mocked(getBraintreeGoogleCredentialsChecked, true);
const getCurrencyMock = mocked(getCurrency, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const getBraintreeShippingOptionsGoogleMock = mocked(getBraintreeShippingOptionsGoogle, true);


describe('testing braintreeCreatePaymentRequestGoogle function', () => {

    const shippingOptionMock: ShippingOptionParameters = {
        shippingOptions: [{
            id: '1',
            label: 'test label',
            description: 'test description'
        }],
        defaultSelectedOptionId: '1'
    };

    const expected = {
        callbackIntents: ['SHIPPING_ADDRESS', 'SHIPPING_OPTION', 'PAYMENT_AUTHORIZATION'],
        emailRequired: true,
        shippingAddressRequired: true,
        shippingAddressParameters: {
            allowedCountryCodes: ['TEST_ISO_CODE'],
            phoneNumberRequired: false,
        },
        shippingOptionRequired: true,
        shippingOptionParameters: shippingOptionMock,
        allowedPaymentMethods: [{
            parameters: {
                billingAddressRequired: true,
                billingAddressParameters: {format: 'FULL', phoneNumberRequired: orderInitialDataMock.general_settings.checkout_process.phone_number_required},
                allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
            },
            tokenizationSpecification: {
                parameters: {
                    gatewayMerchantId: 'test',
                    'braintree:clientKey': '',
                }
            }
        }]
    };

    const googlePayInstanceMock: IBraintreeGooglePayInstance = {
        createPaymentDataRequest: jest.fn().mockReturnValue({
            allowedPaymentMethods: [{
                parameters: {},
                tokenizationSpecification: {
                    parameters: {}
                }
            }]
        }),
        parseResponse: jest.fn()
    };

    beforeEach(() => {
        getCurrencyMock.mockReturnValue(currencyMock);
        getApplicationStateMock.mockReturnValue(applicationStateMock);
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
        getBraintreeShippingOptionsGoogleMock.mockReturnValue(shippingOptionMock);
        getBraintreeGooglePayInstanceCheckedMock.mockReturnValue(googlePayInstanceMock);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getBraintreeGoogleCredentialsCheckedMock.mockReturnValue({merchant_account: 'test', tokenization_key: '',});
    });

    test('testing braintreeCreatePaymentRequestGoogle - successfully ', () => {
        const result = braintreeCreatePaymentRequestGoogle();
        expect(googlePayInstanceMock.createPaymentDataRequest).toHaveBeenCalledTimes(1);
        expect(googlePayInstanceMock.createPaymentDataRequest).toHaveBeenCalledWith({
            transactionInfo: {
                currencyCode: currencyMock.iso_code,
                totalPrice: '100.00',
                totalPriceStatus: 'ESTIMATED'
            }
        });
        expect(result).toStrictEqual(expected);
    });
});
