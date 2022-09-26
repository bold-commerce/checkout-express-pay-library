import {OnApproveActions, OnApproveData} from '@paypal/paypal-js/types/components/buttons';
import {
    API_RETRY,
    callBillingAddressEndpoint,
    callGuestCustomerEndpoint,
    callShippingAddressEndpoint,
    formatPaypalToApiAddress,
    getFirstAndLastName,
    getPaypalGatewayPublicId,
    orderProcessing,
    paypalOnApprove
} from 'src';
import {mocked} from 'jest-mock';
import {
    addPayment,
    baseReturnObject,
    getApplicationState,
    getCurrency,
    IAddress,
    setTaxes
} from '@bold-commerce/checkout-frontend-library';
import {applicationStateMock, currencyMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import {OrderResponseBody} from '@paypal/paypal-js/types/apis/orders';

jest.mock('@bold-commerce/checkout-frontend-library/lib/payment/addPayment');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getApplicationState');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@bold-commerce/checkout-frontend-library/lib/taxes/setTaxes');
jest.mock('src/actions/orderProcessing');
jest.mock('src/paypal/formatPaypalToApiAddress');
jest.mock('src/paypal/managePaypalState');
jest.mock('src/utils/getFirstAndLastName');
jest.mock('src/utils/callBillingAddressEndpoint');
jest.mock('src/utils/callGuestCustomerEndpoint');
jest.mock('src/utils/callShippingAddressEndpoint');
const addPaymentMock = mocked(addPayment, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const getCurrencyMock = mocked(getCurrency, true);
const setTaxesMock = mocked(setTaxes, true);
const orderProcessingMock = mocked(orderProcessing, true);
const getFirstAndLastNameMock = mocked(getFirstAndLastName, true);
const getPaypalGatewayPublicIdMock = mocked(getPaypalGatewayPublicId, true);
const formatPaypalToApiAddressMock = mocked(formatPaypalToApiAddress, true);
const callBillingAddressEndpointMock = mocked(callBillingAddressEndpoint, true);
const callGuestCustomerEndpointMock = mocked(callGuestCustomerEndpoint, true);
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);

const onApproveActionsMock = {
    redirect: jest.fn(),
    restart: jest.fn(),
    order: {
        capture: jest.fn(),
        authorize: jest.fn(),
        get: jest.fn(),
        patch: jest.fn(),
    }
};
const onApproveDataMock: OnApproveData = {orderID: '123', facilitatorAccessToken: ''};
const successReturn = {...baseReturnObject, success: true};
const filled1Address: IAddress = {
    address_line_1: 'Test line 1',
    address_line_2: 'Test line 2',
    business_name: '',
    city: 'Test city',
    country: 'Test Country',
    country_code: 'test_country_code',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '0000000000',
    postal_code: 'M1M1M1',
    province: 'Test Province',
    province_code: 'test_province_code'
};
const filled2Address: IAddress = {
    address_line_1: 'Another Test line 1',
    address_line_2: 'Another Test line 2',
    business_name: '',
    city: 'Another Test city',
    country: 'Another Test Country',
    country_code: 'another_test_country_code',
    first_name: 'Jane',
    last_name: 'Doe',
    phone_number: '0000000000',
    postal_code: 'M2M2M2',
    province: 'Another Test Province',
    province_code: 'another_test_province_code'
};
const johnNames = {firstName: 'John', lastName: 'Doe'};
const janeNames = {firstName: 'Jane', lastName: 'Doe'};
const paypalEmptyAddress = {
    address_line_1: '',
    address_line_2: '',
    postal_code: '',
    country_code: '',
    admin_area_1: '',
    admin_area_2: ''
};
const paypalFilled1Address = {
    address_line_1: 'Test Line 1',
    address_line_2: 'Test Line 2',
    postal_code: 'M1M1M1',
    country_code: 'test_country_code',
    admin_area_1: 'test_province_code',
    admin_area_2: 'test_city'
};
const paypalFilled2Address = {
    address_line_1: 'Another Test Line 1',
    address_line_2: 'Another Test Line 2',
    postal_code: 'M2M2M2',
    country_code: 'another_test_country_code',
    admin_area_1: 'another_test_province_code',
    admin_area_2: 'another_test_city'
};
const payer = {
    payer_id: 'test_payer_id',
    name: {given_name: janeNames.firstName, surname: janeNames.lastName},
    address: paypalEmptyAddress,
    email_address: 'test_email@test.test',
    phone: {phone_number: {national_number: '0000000000'}},
};
const purchaseUnits = [{
    shipping: {
        name: {full_name: 'John Doe'},
        address: paypalFilled1Address,
    }
}];
const paypalOrderResponseMock: OrderResponseBody = {
    create_time: '',
    intent: 'AUTHORIZE',
    links: [],
    status: 'APPROVED',
    update_time: '',
    id: 'test_id',
    payer,
    purchase_units: purchaseUnits
} as unknown as OrderResponseBody;
const paymentRequest = {
    token: 'test_id:test_payer_id',
    nonce: 'test_id:test_payer_id',
    gateway_public_id: 'abc123',
    currency: 'USD',
    amount: 10000,
};

describe('testing  paypalOnApprove function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        addPaymentMock.mockReturnValue(Promise.resolve(successReturn));
        getApplicationStateMock.mockReturnValue(applicationStateMock);
        setTaxesMock.mockReturnValue(Promise.resolve(successReturn));
        getFirstAndLastNameMock.mockReturnValue(johnNames);
        getPaypalGatewayPublicIdMock.mockReturnValue('abc123');
        formatPaypalToApiAddressMock
            .mockReturnValueOnce(filled1Address)
            .mockReturnValueOnce(filled2Address);
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve(successReturn));
        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve(successReturn));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve(successReturn));
        onApproveActionsMock.order.get.mockReturnValue(Promise.resolve(paypalOrderResponseMock));
    });

    test('billing empty and success', async () => {
        await paypalOnApprove(onApproveDataMock, onApproveActionsMock);

        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(onApproveActionsMock.order.get).toHaveBeenCalledTimes(1);
        expect(getFirstAndLastNameMock).toHaveBeenCalledTimes(1);
        expect(getFirstAndLastNameMock).toHaveBeenCalledWith(purchaseUnits[0].shipping?.name?.full_name);
        expect(callGuestCustomerEndpointMock).toHaveBeenCalledTimes(1);
        expect(callGuestCustomerEndpointMock).toHaveBeenCalledWith(payer.name.given_name, payer.name.surname, payer.email_address);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(2);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(paypalFilled1Address, johnNames.firstName, johnNames.lastName, payer.phone.phone_number.national_number);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(paypalFilled1Address, janeNames.firstName, janeNames.lastName, payer.phone.phone_number.national_number);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(filled1Address, false);
        expect(callBillingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callBillingAddressEndpointMock).toHaveBeenCalledWith(filled2Address, false);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(setTaxesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getApplicationStateMock).toHaveBeenCalledTimes(1);
        expect(getPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(addPaymentMock).toHaveBeenCalledTimes(1);
        expect(addPaymentMock).toHaveBeenCalledWith(paymentRequest, API_RETRY);
        expect(orderProcessingMock).toHaveBeenCalledTimes(1);
    });

    test('billing filled equal shipping, equal names and success', async () => {
        const newName = {given_name: johnNames.firstName, surname: johnNames.lastName};
        const newPayer = {...payer, name: newName, address: paypalFilled1Address};
        const paypalOrder = {...paypalOrderResponseMock, payer: newPayer};
        onApproveActionsMock.order.get.mockReturnValueOnce(Promise.resolve(paypalOrder));

        await paypalOnApprove(onApproveDataMock, onApproveActionsMock);

        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(onApproveActionsMock.order.get).toHaveBeenCalledTimes(1);
        expect(getFirstAndLastNameMock).toHaveBeenCalledTimes(1);
        expect(getFirstAndLastNameMock).toHaveBeenCalledWith(purchaseUnits[0].shipping?.name?.full_name);
        expect(callGuestCustomerEndpointMock).toHaveBeenCalledTimes(1);
        expect(callGuestCustomerEndpointMock).toHaveBeenCalledWith(johnNames.firstName, johnNames.lastName, payer.email_address);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(2);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(paypalFilled1Address, johnNames.firstName, johnNames.lastName, payer.phone.phone_number.national_number);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(paypalFilled1Address, johnNames.firstName, johnNames.lastName, payer.phone.phone_number.national_number);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(filled1Address, false);
        expect(callBillingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callBillingAddressEndpointMock).toHaveBeenCalledWith(filled1Address, false);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(setTaxesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getApplicationStateMock).toHaveBeenCalledTimes(1);
        expect(getPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(addPaymentMock).toHaveBeenCalledTimes(1);
        expect(addPaymentMock).toHaveBeenCalledWith(paymentRequest, API_RETRY);
        expect(orderProcessingMock).toHaveBeenCalledTimes(1);
    });

    test('billing filled diff then shipping and success', async () => {
        const newPayer = {...payer, address: paypalFilled2Address};
        const paypalOrder = {...paypalOrderResponseMock, payer: newPayer};
        onApproveActionsMock.order.get.mockReturnValueOnce(Promise.resolve(paypalOrder));

        await paypalOnApprove(onApproveDataMock, onApproveActionsMock);

        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(onApproveActionsMock.order.get).toHaveBeenCalledTimes(1);
        expect(getFirstAndLastNameMock).toHaveBeenCalledTimes(1);
        expect(getFirstAndLastNameMock).toHaveBeenCalledWith(purchaseUnits[0].shipping?.name?.full_name);
        expect(callGuestCustomerEndpointMock).toHaveBeenCalledTimes(1);
        expect(callGuestCustomerEndpointMock).toHaveBeenCalledWith(payer.name.given_name, payer.name.surname, payer.email_address);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(2);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(paypalFilled1Address, johnNames.firstName, johnNames.lastName, payer.phone.phone_number.national_number);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(paypalFilled2Address, janeNames.firstName, janeNames.lastName, payer.phone.phone_number.national_number);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(filled1Address, false);
        expect(callBillingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callBillingAddressEndpointMock).toHaveBeenCalledWith(filled2Address, true);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(setTaxesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getApplicationStateMock).toHaveBeenCalledTimes(1);
        expect(getPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(addPaymentMock).toHaveBeenCalledTimes(1);
        expect(addPaymentMock).toHaveBeenCalledWith(paymentRequest, API_RETRY);
        expect(orderProcessingMock).toHaveBeenCalledTimes(1);
    });

    test('null keys in order', async () => {
        const newPayer = {...payer, address: null, email_address: null, phone: null, name: null};
        const newShipping = {...purchaseUnits[0].shipping, name: null};
        const newPurchaseUnits = [{shipping: newShipping}];
        const paypalOrder = {...paypalOrderResponseMock, payer: newPayer, purchase_units: newPurchaseUnits};
        onApproveActionsMock.order.get.mockReturnValueOnce(Promise.resolve(paypalOrder));

        await paypalOnApprove(onApproveDataMock, onApproveActionsMock);

        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(onApproveActionsMock.order.get).toHaveBeenCalledTimes(1);
        expect(getFirstAndLastNameMock).toHaveBeenCalledTimes(1);
        expect(getFirstAndLastNameMock).toHaveBeenCalledWith(undefined);
        expect(callGuestCustomerEndpointMock).toHaveBeenCalledTimes(1);
        expect(callGuestCustomerEndpointMock).toHaveBeenCalledWith('', '', '');
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(2);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(paypalFilled1Address, '', '', '');
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(paypalFilled1Address, '', '', '');
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(filled1Address, false);
        expect(callBillingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callBillingAddressEndpointMock).toHaveBeenCalledWith(filled2Address, false);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(setTaxesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getApplicationStateMock).toHaveBeenCalledTimes(1);
        expect(getPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(addPaymentMock).toHaveBeenCalledTimes(1);
        expect(addPaymentMock).toHaveBeenCalledWith(paymentRequest, API_RETRY);
        expect(orderProcessingMock).toHaveBeenCalledTimes(1);
    });

    test('action missing order in order', async () => {
        const actions = {...onApproveActionsMock, order: null};

        await paypalOnApprove(onApproveDataMock, actions as unknown as OnApproveActions);

        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(onApproveActionsMock.order.get).toHaveBeenCalledTimes(0);
        expect(getFirstAndLastNameMock).toHaveBeenCalledTimes(0);
        expect(callGuestCustomerEndpointMock).toHaveBeenCalledTimes(0);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(0);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(0);
        expect(callBillingAddressEndpointMock).toHaveBeenCalledTimes(0);
        expect(setTaxesMock).toHaveBeenCalledTimes(0);
        expect(getApplicationStateMock).toHaveBeenCalledTimes(0);
        expect(getPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(0);
        expect(addPaymentMock).toHaveBeenCalledTimes(0);
        expect(orderProcessingMock).toHaveBeenCalledTimes(0);
    });

});
