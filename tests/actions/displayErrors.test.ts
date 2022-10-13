import {mocked} from 'jest-mock';
import {actionTypes, displayError, getOnAction} from 'src';


jest.mock('src/initialize/manageExpressPayContext');
const getOnActionMock = mocked(getOnAction, true);

describe('testing displayError function', () => {
    const onActionReturnMock = jest.fn();
    const data = [
        {name: 'calling with success', message: 'testing', section: 'payment', term: 'error', payload: {message: 'testing', details: {section: 'payment', term: 'error'}}, expectOnActionCall: 1},
        {name: 'calling with undefined term & section', message: 'testing', section: undefined, term: undefined, payload: {message: 'testing', details: {section: '', term: ''}},  expectOnActionCall: 1},
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test.each(data)('$name', ({ message, section, term, payload, expectOnActionCall}) => {
        getOnActionMock.mockReturnValueOnce(onActionReturnMock);
        displayError(message, section, term);
        expect(onActionReturnMock).toHaveBeenCalledTimes(expectOnActionCall);
        expect(onActionReturnMock).toHaveBeenCalledWith(actionTypes.DISPLAY_ERROR, payload);
    });

    test('calling with undefined action', () => {
        const message = 'this is test message';
        const payload =  {message: 'testing', details: {section: '', term: ''}};
        getOnActionMock.mockReturnValueOnce(null);
        displayError(message);
        expect(onActionReturnMock).toHaveBeenCalledTimes(0);
        expect(onActionReturnMock).not.toHaveBeenCalledWith(actionTypes.DISPLAY_ERROR, payload);
    });
});
