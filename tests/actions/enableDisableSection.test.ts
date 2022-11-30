import {
    actionTypes,
    enableDisableSection,
    getOnAction,
    IShowPaymentMethods,
    showPaymentMethods,
    showPaymentMethodTypes
} from 'src';
import {mocked} from 'jest-mock';

jest.mock('src/initialize/manageExpressPayContext');
const getOnActionMock = mocked(getOnAction, true);

describe('testing showHideExpressPaySection function', () => {
    const enableDisableCallbackMock = jest.fn();
    const withCallbackAllFalseTestSet = [
        { type: showPaymentMethodTypes.STRIPE, show: false, expectCallbackParam: false },
        { type: showPaymentMethodTypes.STRIPE, show: true, expectCallbackParam: true },
        { type: showPaymentMethodTypes.PAYPAL, show: false, expectCallbackParam: false },
        { type: showPaymentMethodTypes.PAYPAL, show: true, expectCallbackParam: true },
    ];
    const withCallbackExtraTrueTestSet = [
        { type: showPaymentMethodTypes.STRIPE, show: false, extraType: showPaymentMethodTypes.PAYPAL, expectCallbackParam: true },
        { type: showPaymentMethodTypes.STRIPE, show: true, extraType: showPaymentMethodTypes.PAYPAL, expectCallbackParam: true },
        { type: showPaymentMethodTypes.PAYPAL, show: false, extraType: showPaymentMethodTypes.STRIPE, expectCallbackParam: true },
        { type: showPaymentMethodTypes.PAYPAL, show: true, extraType: showPaymentMethodTypes.STRIPE, expectCallbackParam: true },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        for(const method in showPaymentMethods){
            showPaymentMethods[method as keyof IShowPaymentMethods] = false;
        }
    });

    test.each(withCallbackAllFalseTestSet)('testing set $type $show with all false and callback', ({type, show, expectCallbackParam}) => {
        getOnActionMock.mockReturnValueOnce(enableDisableCallbackMock);
        enableDisableSection(type, show);

        expect(enableDisableCallbackMock).toHaveBeenCalledTimes(1);
        expect(enableDisableCallbackMock).toHaveBeenCalledWith( actionTypes.ENABLE_DISABLE_SECTION, {show: expectCallbackParam});
        expect(showPaymentMethods[type as keyof IShowPaymentMethods]).toBe(show);
    });

    test.each(withCallbackExtraTrueTestSet)('testing set $type $show with $extraType true and callback', ({type, show, extraType, expectCallbackParam}) => {
        showPaymentMethods[extraType as keyof IShowPaymentMethods] = true;
        getOnActionMock.mockReturnValueOnce(enableDisableCallbackMock);
        enableDisableSection(type, show);

        expect(enableDisableCallbackMock).toHaveBeenCalledTimes(1);
        expect(enableDisableCallbackMock).toHaveBeenCalledWith( actionTypes.ENABLE_DISABLE_SECTION, {show: expectCallbackParam});
        expect(showPaymentMethods[type as keyof IShowPaymentMethods]).toBe(show);
        expect(showPaymentMethods[extraType as keyof IShowPaymentMethods]).toBe(true);
    });

    test.each(withCallbackAllFalseTestSet)('testing set $type $show with all false and no callback', ({type, show}) => {
        enableDisableSection(type, show);

        expect(enableDisableCallbackMock).toHaveBeenCalledTimes(0);
        expect(showPaymentMethods[type as keyof IShowPaymentMethods]).toBe(show);
    });

    test.each(withCallbackExtraTrueTestSet)('testing set $type $show with $extraType true and no callback', ({type, show, extraType}) => {
        showPaymentMethods[extraType as keyof IShowPaymentMethods] = true;

        enableDisableSection(type, show);

        expect(enableDisableCallbackMock).toHaveBeenCalledTimes(0);
        expect(showPaymentMethods[type as keyof IShowPaymentMethods]).toBe(show);
        expect(showPaymentMethods[extraType as keyof IShowPaymentMethods]).toBe(true);
    });

});
