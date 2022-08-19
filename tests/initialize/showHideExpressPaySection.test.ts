import {alternatePaymentMethodType} from '@bold-commerce/checkout-frontend-library';
import {IShowPaymentMethods, showHideExpressPaySection, showPaymentMethods} from 'src';

describe('testing showHideExpressPaySection function', () => {
    const showHideCallbackMock = jest.fn();
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
        showHideExpressPaySection(type, show, showHideCallbackMock);

        expect(showHideCallbackMock).toHaveBeenCalledTimes(1);
        expect(showHideCallbackMock).toHaveBeenCalledWith(expectCallbackParam);
        expect(showPaymentMethods[type as keyof IShowPaymentMethods]).toBe(show);
    });

    test.each(withCallbackExtraTrueTestSet)('testing set $type $show with $extraType true and callback', ({type, show, extraType, expectCallbackParam}) => {
        showPaymentMethods[extraType as keyof IShowPaymentMethods] = true;

        showHideExpressPaySection(type, show, showHideCallbackMock);

        expect(showHideCallbackMock).toHaveBeenCalledTimes(1);
        expect(showHideCallbackMock).toHaveBeenCalledWith(expectCallbackParam);
        expect(showPaymentMethods[type as keyof IShowPaymentMethods]).toBe(show);
        expect(showPaymentMethods[extraType as keyof IShowPaymentMethods]).toBe(true);
    });

    test.each(withCallbackAllFalseTestSet)('testing set $type $show with all false and no callback', ({type, show}) => {
        showHideExpressPaySection(type, show);

        expect(showHideCallbackMock).toHaveBeenCalledTimes(0);
        expect(showPaymentMethods[type as keyof IShowPaymentMethods]).toBe(show);
    });

    test.each(withCallbackExtraTrueTestSet)('testing set $type $show with $extraType true and no callback', ({type, show, extraType}) => {
        showPaymentMethods[extraType as keyof IShowPaymentMethods] = true;

        showHideExpressPaySection(type, show);

        expect(showHideCallbackMock).toHaveBeenCalledTimes(0);
        expect(showPaymentMethods[type as keyof IShowPaymentMethods]).toBe(show);
        expect(showPaymentMethods[extraType as keyof IShowPaymentMethods]).toBe(true);
    });

});
