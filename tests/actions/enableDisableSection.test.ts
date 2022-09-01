import {alternatePaymentMethodType} from '@bold-commerce/checkout-frontend-library';
import {actionTypes, enableDisableSection, getOnAction, IShowPaymentMethods, showPaymentMethods} from 'src';
import {mocked} from 'jest-mock';

jest.mock('src/initialize/manageExpressPayContext');
const getOnActionMock = mocked(getOnAction, true);

describe('testing showHideExpressPaySection function', () => {
    const enableDisableCallbackMock = jest.fn();
    const withCallbackAllFalseTestSet = [
        { type: alternatePaymentMethodType.STRIPE, show: false, expectCallbackParam: false },
        { type: alternatePaymentMethodType.STRIPE, show: true, expectCallbackParam: true },
        { type: alternatePaymentMethodType.PAYPAL, show: false, expectCallbackParam: false },
        { type: alternatePaymentMethodType.PAYPAL, show: true, expectCallbackParam: true },
    ];
    const withCallbackExtraTrueTestSet = [
        { type: alternatePaymentMethodType.STRIPE, show: false, extraType: alternatePaymentMethodType.PAYPAL, expectCallbackParam: true },
        { type: alternatePaymentMethodType.STRIPE, show: true, extraType: alternatePaymentMethodType.PAYPAL, expectCallbackParam: true },
        { type: alternatePaymentMethodType.PAYPAL, show: false, extraType: alternatePaymentMethodType.STRIPE, expectCallbackParam: true },
        { type: alternatePaymentMethodType.PAYPAL, show: true, extraType: alternatePaymentMethodType.STRIPE, expectCallbackParam: true },
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
