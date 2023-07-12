import {mocked} from 'jest-mock';
import {getApplicationState} from '@boldcommerce/checkout-frontend-library';
import {applicationStateMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {getPaymentRequestDisplayItems, getTotals, ITotals} from 'src';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('src/utils/getTotals');
const getApplicationStateMock = mocked(getApplicationState, true);
const getTotalsMock = mocked(getTotals, true);

describe('testing getPaymentRequestDisplayItems function', () => {

    const appState = {...applicationStateMock};
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 1000,
        totalAmountDue: 0,
        totalPaid: 1,
        totalFees: 1200,
        totalTaxes: 0,
        totalDiscounts: 1,
        totalAdditionalFees: 0
    };
    beforeEach(() => {
        jest.clearAllMocks();
        getApplicationStateMock.mockReturnValue(appState);
        getTotalsMock.mockReturnValue(totals);
    });

    test('testing the getPaymentRequestDisplayItems function', () => {
        const result = getPaymentRequestDisplayItems();
        expect(result).toStrictEqual([
            {amount: 1000, label: 'title'},
            {amount: 2, label: 'Discounts'},
            {amount: 0, label: 'Taxes'},
            {amount: 100, label: 'Shipping'},
            {amount: 1200, label: 'Fees'},
        ]);
    });

    test('testing the getPaymentRequestDisplayItems function without fees and shipping', () => {
        const localAppState = {...appState};
        localAppState.fees = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        localAppState.shipping.selected_shipping = undefined;
        getApplicationStateMock.mockReturnValueOnce(localAppState);
        getTotalsMock.mockReturnValueOnce({...totals, totalFees: 0});
        const result = getPaymentRequestDisplayItems();
        expect(result).toStrictEqual([
            {amount: 1000, label: 'title'},
            {amount: 2, label: 'Discounts'},
            {amount: 0, label: 'Taxes'},
            {amount: 0, label: 'Shipping'},
            {amount: 0, label: 'Fees'},
        ]);
    });

});
