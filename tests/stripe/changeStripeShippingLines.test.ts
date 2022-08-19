import {changeStripeShippingLines} from 'src/stripe';
import {API_RETRY, IStripeShippingOptions} from 'src/types';
import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    changeShippingLine,
    getApplicationState,
    IApplicationState
} from '@bold-commerce/checkout-frontend-library';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('@bold-commerce/checkout-frontend-library/lib/shipping');
const getApplicationStateMock = mocked(getApplicationState, true);
const changeShippingLineMock = mocked(changeShippingLine, true);

describe('testing change shipping lines function', () => {
    const orderTotal = 200;
    const updateWithMock = jest.fn();
    const shippingOptionMock: IStripeShippingOptions = {
        id: '2',
        amount: 1999,
        label: 'test line'
    };
    const returnObject = {...baseReturnObject};

    beforeEach(() => {
        jest.clearAllMocks();
        getApplicationStateMock.mockReturnValue({order_total: orderTotal} as IApplicationState);
    });

    test('testing the function with success', async () => {
        returnObject.success = true;
        changeShippingLineMock.mockReturnValueOnce(Promise.resolve(returnObject));
        await changeStripeShippingLines({shippingOption: shippingOptionMock, updateWith: updateWithMock});

        expect(getApplicationStateMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith(shippingOptionMock.id, API_RETRY);
        expect(updateWithMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toBeCalledWith({
            total: {
                label: 'Total',
                amount: orderTotal,
                pending: true,
            },
            status: 'success'
        });
    });

    test('testing the function with failure', async () => {
        returnObject.success = false;
        changeShippingLineMock.mockReturnValueOnce(Promise.resolve(returnObject));
        await changeStripeShippingLines({shippingOption: shippingOptionMock, updateWith: updateWithMock});

        expect(getApplicationStateMock).toHaveBeenCalledTimes(0);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith(shippingOptionMock.id, API_RETRY);
        expect(updateWithMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toBeCalledWith({
            status: 'fail'
        });
    });

});
