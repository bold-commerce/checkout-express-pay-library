import {
    changeStripeShippingLines,
    getPaymentRequestDisplayItems,
    API_RETRY,
    IStripeShippingOptions,
    getTotals,
    ITotals
} from 'src';
import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    changeShippingLine
} from '@bold-commerce/checkout-frontend-library';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('@bold-commerce/checkout-frontend-library/lib/shipping');
jest.mock('src/utils/getPaymentRequestDisplayItems');
jest.mock('src/utils/getTotals');
const getTotalsMock = mocked(getTotals, true);
const changeShippingLineMock = mocked(changeShippingLine, true);
const getPaymentRequestDisplayItemMock = mocked(getPaymentRequestDisplayItems, true);

describe('testing change shipping lines function', () => {
    const orderTotal = 200;
    const updateWithMock = jest.fn();
    const shippingOptionMock: IStripeShippingOptions = {
        id: '2',
        amount: 1999,
        label: 'test line'
    };
    const returnObject = {...baseReturnObject};
    const displayItemMock = [{label: 'test', amount: 1200}];
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: orderTotal,
        totalAmountDue: orderTotal,
        totalPaid: 0,
        totalFees: 1200,
        totalTaxes: 0,
        totalDiscounts: 1,
        totalAdditionalFees: 0
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTotalsMock.mockReturnValue(totals);
        getPaymentRequestDisplayItemMock.mockReturnValueOnce(displayItemMock);
    });

    test('testing the function with success', async () => {
        returnObject.success = true;
        changeShippingLineMock.mockReturnValueOnce(Promise.resolve(returnObject));
        await changeStripeShippingLines({shippingOption: shippingOptionMock, updateWith: updateWithMock});

        expect(getTotalsMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith(shippingOptionMock.id, API_RETRY);
        expect(updateWithMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toBeCalledWith({
            total: {
                label: 'Total',
                amount: orderTotal,
            },
            status: 'success',
            displayItems: displayItemMock
        });
    });

    test('testing the function with failure', async () => {
        returnObject.success = false;
        changeShippingLineMock.mockReturnValueOnce(Promise.resolve(returnObject));
        await changeStripeShippingLines({shippingOption: shippingOptionMock, updateWith: updateWithMock});

        expect(getTotalsMock).toHaveBeenCalledTimes(0);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith(shippingOptionMock.id, API_RETRY);
        expect(updateWithMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toBeCalledWith({
            status: 'fail'
        });
    });

});
