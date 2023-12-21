import {applicationStateMock, orderInitialDataMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {
    addPayment,
    baseReturnObject,
    getOrderInitialData,
    processOrder,
    setBillingAddress,
    setTaxes,
} from '@boldcommerce/checkout-frontend-library';
import {
    formatStripeBillingAddress,
    formatStripeShippingAddress,
    addStripePayment,
    IStripeCard,
    IStripePaymentEvent,
    callGuestCustomerEndpoint,
    getTotals,
    ITotals,
    callShippingAddressEndpoint
} from 'src';
import {mocked} from 'jest-mock';


jest.mock('src/stripe/formatStripeShippingAddress');
jest.mock('src/stripe/formatStripeBillingAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/address');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/customer');
jest.mock('@boldcommerce/checkout-frontend-library/lib/payment');
jest.mock('@boldcommerce/checkout-frontend-library/lib/order');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes/setTaxes');
jest.mock('src/utils/callGuestCustomerEndpoint');
jest.mock('src/utils/getTotals');
jest.mock('src/utils/callShippingAddressEndpoint');
const formatStripeShippingAddressMock = mocked(formatStripeShippingAddress, true);
const formatStripeBillingAddressMock = mocked(formatStripeBillingAddress, true);
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);
const setBillingAddressMock = mocked(setBillingAddress, true);
const addPaymentMock = mocked(addPayment, true);
const processOrderMock = mocked(processOrder, true);
const getTotalsMock = mocked(getTotals, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const callGuestCustomerEndpointMock = mocked(callGuestCustomerEndpoint, true);
const setTaxesMock = mocked(setTaxes, true);
const canMakePaymentsMock = jest.fn();
const applePaySession = {canMakePayments: canMakePaymentsMock};

describe('testing stripe payment function', () => {

    const appState = {...applicationStateMock};
    appState.customer.platform_id = '0';
    const failApi = {...baseReturnObject, success: false};
    const successApi = {...baseReturnObject, success: true};
    const completeMock = jest.fn();
    const orderInitialData = {...orderInitialDataMock};
    orderInitialData.general_settings.checkout_process.phone_number_required = true;

    const data = [
        {name: 'success on all endpoints', guestCustomer: successApi, callShipping: successApi, setBilling: successApi, setTaxes: successApi, addPayment: successApi, processOrder: successApi, expected: 'success' },
        {name: 'failed guest customer', guestCustomer: failApi, callShipping: successApi, setBilling: successApi, setTaxes: successApi,  addPayment: successApi, processOrder: successApi, expected: 'fail' },
        {name: 'failed update shipping', guestCustomer: successApi, callShipping: failApi, setBilling: successApi, setTaxes: successApi,  addPayment: successApi, processOrder: successApi, expected: 'fail' },
        {name: 'failed update billing', guestCustomer: successApi, callShipping: successApi, setBilling: failApi, setTaxes: successApi,  addPayment: successApi, processOrder: successApi, expected: 'fail' },
        {name: 'failed add payment', guestCustomer: successApi, callShipping: successApi, setBilling: successApi, setTaxes: successApi,  addPayment: failApi, processOrder: successApi, expected: 'fail' },
        {name: 'failed on set taxes', guestCustomer: successApi, callShipping: successApi, setBilling: successApi, setTaxes: failApi, addPayment: successApi, processOrder: successApi, expected: 'fail' },
    ];

    const cardMock: IStripeCard = {
        address_city: 'winnipeg',
        address_country: 'CA',
        address_line1: 'abc address',
        address_line1_check: '',
        address_line2: '',
        address_state: 'MB',
        address_zip: 'R3Y',
        address_zip_check: '',
        brand: 'Visa',
        country: 'CA',
        dynamic_last4: '1111',
        exp_month: 8,
        exp_year: 2023,
        funding: '',
        id: 'test-id',
        last4: '1111',
        name: '',
        object: '',
        tokenization_method: '',
        currency: 'CAD',
        cvc_check: '',
    };

    const eventMock: IStripePaymentEvent = {
        updateWith: jest.fn(),
        token: {
            client_ip: 'test',
            created: 1234567,
            id: 'test_id',
            livemode: false,
            object: '',
            type: 'applepay',
            used: false,
            card: cardMock
        },
        shippingAddress: {
            phone: '',
            recipient: 'Card holder'
        },
        complete: completeMock
    };
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 10000,
        totalAmountDue: 10000,
        totalPaid: 0,
        totalFees: 1200,
        totalTaxes: 0,
        totalDiscounts: 1,
        totalAdditionalFees: 0
    };

    beforeEach(() => {
        jest.resetAllMocks();
        formatStripeShippingAddressMock.mockReturnValue(appState.addresses.shipping);
        formatStripeBillingAddressMock.mockReturnValue(appState.addresses.billing);
        getTotalsMock.mockReturnValue(totals);
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
        window.ApplePaySession = applePaySession;

    });

    test.each(data)('$name', async ({guestCustomer, callShipping, setBilling, setTaxes, addPayment, processOrder, expected}) => {
        callGuestCustomerEndpointMock.mockReturnValueOnce(Promise.resolve(guestCustomer));
        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(callShipping));
        setBillingAddressMock.mockReturnValueOnce(Promise.resolve(setBilling));
        setTaxesMock.mockReturnValueOnce(Promise.resolve(setTaxes));
        addPaymentMock.mockReturnValueOnce(Promise.resolve(addPayment));
        processOrderMock.mockReturnValueOnce(Promise.resolve(processOrder));
        canMakePaymentsMock.mockReturnValueOnce(false);

        await addStripePayment(eventMock, 'test-id');
        expect(completeMock).toBeCalled();
        expect(completeMock).toHaveBeenCalledWith(expected);
    });

    test('calling add customer with payer details', async () => {
        const localEventMock = {...eventMock};
        localEventMock.payerName = 'John steve';
        localEventMock.payerEmail = 'abc@gmail.com';
        callGuestCustomerEndpointMock.mockReturnValueOnce(Promise.resolve(successApi));
        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(successApi));
        setBillingAddressMock.mockReturnValueOnce(Promise.resolve(successApi));
        setTaxesMock.mockReturnValueOnce(Promise.resolve(successApi));
        addPaymentMock.mockReturnValueOnce(Promise.resolve(successApi));
        processOrderMock.mockReturnValueOnce(Promise.resolve(successApi));
        canMakePaymentsMock.mockReturnValueOnce(true);
        await addStripePayment(localEventMock, 'test-id');
        expect(completeMock).toBeCalled();
        expect(completeMock).toHaveBeenCalledWith('success');
        expect(callGuestCustomerEndpointMock).toHaveBeenCalledWith('John', 'steve', 'abc@gmail.com');
        localEventMock.payerName = '';
    });

});
