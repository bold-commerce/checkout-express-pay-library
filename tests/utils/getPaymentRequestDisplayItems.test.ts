import {mocked} from 'jest-mock';
import {getApplicationState} from '@bold-commerce/checkout-frontend-library';
import {applicationStateMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import {getPaymentRequestDisplayItems} from 'src';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
const getApplicationStateMock = mocked(getApplicationState, true);

describe('testing getPaymentRequestDisplayItems function', () => {

    const appState = {...applicationStateMock};
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('testing the getPaymentRequestDisplayItems function', () => {
        getApplicationStateMock.mockReturnValue(appState);
        const result = getPaymentRequestDisplayItems();
        expect(result).toStrictEqual([
            {amount: 1000, label: 'title'},
            {amount: 1, label: 'Discounts'},
            {amount: 0, label: 'Taxes'},
            {amount: 100, label: 'Shipping'},
            {amount: 1200, label: 'Fees'},
        ]);
    });

    test('testing the getPaymentRequestDisplayItems function without fees and shipping', () => {
        const localAppState = {...appState};
        localAppState.fees = undefined;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        localAppState.shipping.selected_shipping = undefined;
        getApplicationStateMock.mockReturnValue(localAppState);
        const result = getPaymentRequestDisplayItems();
        expect(result).toStrictEqual([
            {amount: 1000, label: 'title'},
            {amount: 1, label: 'Discounts'},
            {amount: 0, label: 'Taxes'},
            {amount: 0, label: 'Shipping'},
            {amount: 0, label: 'Fees'},
        ]);
    });

});
