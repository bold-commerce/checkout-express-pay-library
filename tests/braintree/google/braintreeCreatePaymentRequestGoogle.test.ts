import {
    braintreeCreatePaymentRequestGoogle,
    getBraintreeGoogleCredentialsChecked,
    getBraintreeGooglePayInstanceChecked,
    getBraintreeShippingOptionsGoogle,
    getTotals,
    IBraintreeGooglePayInstance,
    ITotals
} from 'src';
import mocked = jest.mocked;
import {getCurrency, getOrderInitialData} from '@boldcommerce/checkout-frontend-library';
import {
    currencyMock,
    orderInitialDataMock
} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import ShippingOptionParameters = google.payments.api.ShippingOptionParameters;

jest.mock('src/braintree/manageBraintreeState');
jest.mock('src/braintree/google/getBraintreeShippingOptionsGoogle');
jest.mock('src/utils/getTotals');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/');
const getBraintreeGooglePayInstanceCheckedMock = mocked(getBraintreeGooglePayInstanceChecked, true);
const getBraintreeGoogleCredentialsCheckedMock = mocked(getBraintreeGoogleCredentialsChecked, true);
const getCurrencyMock = mocked(getCurrency, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const getTotalsMock = mocked(getTotals, true);
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
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 10000,
        totalAmountDue: 9800,
        totalPaid: 1,
        totalFees: 1200,
        totalTaxes: 0,
        totalDiscounts: 1,
        totalAdditionalFees: 0
    };

    beforeEach(() => {
        getCurrencyMock.mockReturnValue(currencyMock);
        getTotalsMock.mockReturnValue(totals);
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
                totalPrice: '98.00',
                totalPriceStatus: 'ESTIMATED'
            }
        });
        expect(result).toStrictEqual(expected);
    });
});
