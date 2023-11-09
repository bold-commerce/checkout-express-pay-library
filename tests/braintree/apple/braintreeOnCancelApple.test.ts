import {braintreeOnCancelApple, getOnAction} from 'src';
import {mocked} from 'jest-mock';

jest.mock('src/initialize/manageExpressPayContext');
const getOnActionMock = mocked(getOnAction, true);

describe('braintreeOnCancelApple', () => {

    const onActionReturnMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test('doesnt explode', () => {
        getOnActionMock.mockReturnValueOnce(onActionReturnMock);
        braintreeOnCancelApple();
        expect(onActionReturnMock).toHaveBeenCalledTimes(1);
    });
});
