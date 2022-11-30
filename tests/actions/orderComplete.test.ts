import {mocked} from 'jest-mock';
import {actionTypes, getOnAction, orderProcessing} from 'src';
import {orderCompleted} from 'src/actions';

jest.mock('src/initialize/manageExpressPayContext');
const getOnActionMock = mocked(getOnAction, true);

describe('testing orderCompleted function', () => {
    const onActionReturnMock = jest.fn();
    const data = [
        {name: 'calling with success', onActionReturn: onActionReturnMock, payload: {test: 'abc'}, expectOnActionCall: 1},
        {name: 'calling with undefined payload', onActionReturn: onActionReturnMock, payload: undefined, expectOnActionCall: 1},
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test.each(data)('$name', ({onActionReturn, payload, expectOnActionCall}) => {
        getOnActionMock.mockReturnValueOnce(onActionReturn);
        orderCompleted(payload);
        expect(onActionReturnMock).toHaveBeenCalledTimes(expectOnActionCall);
        expect(onActionReturnMock).toHaveBeenCalledWith(actionTypes.ORDER_COMPLETED, payload);
    });

    test('calling with undefined action', () => {
        const payload = {test: 'abc'};
        getOnActionMock.mockReturnValueOnce(null);
        orderProcessing(payload);
        expect(onActionReturnMock).toHaveBeenCalledTimes(0);
        expect(onActionReturnMock).not.toHaveBeenCalledWith(actionTypes.ORDER_COMPLETED, payload);
    });
});
