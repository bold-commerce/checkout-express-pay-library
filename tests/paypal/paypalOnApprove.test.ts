import {OnApproveData} from '@paypal/paypal-js/types/components/buttons';
import {
    displayError,
    orderProcessing,
    paypalOnApprove,
} from 'src';
import {mocked} from 'jest-mock';
import {
    addPayment,
    baseReturnObject,
    getApplicationState,
    getCurrency,
    walletPayOnApprove
} from '@boldcommerce/checkout-frontend-library';
import {applicationStateMock, currencyMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {OrderResponseBody} from '@paypal/paypal-js/types/apis/orders';


jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@boldcommerce/checkout-frontend-library/lib/walletPay/walletPayOnApprove');
jest.mock('@boldcommerce/checkout-frontend-library/lib/payment/addPayment');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getApplicationState');
jest.mock('src/actions/orderProcessing');
jest.mock('src/actions/displayError');

const addPaymentMock = mocked(addPayment, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const getCurrencyMock = mocked(getCurrency, true);
const orderProcessingMock = mocked(orderProcessing, true);
const displayErrorMock = mocked(displayError, true);
const walletPayOnApproveMock = mocked(walletPayOnApprove, true);

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
const onApproveDataMock: OnApproveData = {orderID: '123', facilitatorAccessToken: '', payerID: 'payerId'};
const successReturn = {...baseReturnObject, success: true};
const failureReturn = {...baseReturnObject, success: false};
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
    purchase_units: purchaseUnits,
    payment_source: ''
} as unknown as OrderResponseBody;

describe('testing  paypalOnApprove function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);

        getApplicationStateMock.mockReturnValue(applicationStateMock);
        onApproveActionsMock.order.get.mockReturnValue(Promise.resolve(paypalOrderResponseMock));
    });

    const data = [
        {name: 'error in wallet pay endpoint endpoint', onApprove: failureReturn, payment: successReturn, displayErrorCount: 1, orderProcessing: 0 },
        {name: 'error in add payment', onApprove: successReturn, payment: failureReturn, displayErrorCount: 1, orderProcessing: 0 },
        {name: 'success in all endpoint', onApprove: successReturn, payment: successReturn, displayErrorCount: 0, orderProcessing: 1 },
    ];

    test.each(data)('$name', async ({onApprove, payment, displayErrorCount, orderProcessing}) => {
        walletPayOnApproveMock.mockReturnValue(Promise.resolve(onApprove));
        addPaymentMock.mockReturnValue(Promise.resolve(payment));

        await paypalOnApprove(onApproveDataMock);
        expect(displayErrorMock).toHaveBeenCalledTimes(displayErrorCount);
        expect(orderProcessingMock).toHaveBeenCalledTimes(orderProcessing);

    });

});
