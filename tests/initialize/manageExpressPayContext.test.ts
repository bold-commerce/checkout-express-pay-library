import {expressPayContext, getOnAction, setOnAction} from 'src';


describe('testing manageExpressPayContext function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('testing setOnAction', () => {
        const onActionMock = jest.fn();
        setOnAction(onActionMock);
        expect(expressPayContext.onAction).toBe(onActionMock);
    });

    test('testing getOnAction', () => {
        const onActionMock = jest.fn();
        setOnAction(onActionMock);
        const getAction = getOnAction();
        expect(getAction).toBe(onActionMock);
    });

});
