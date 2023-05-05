import {mocked} from 'jest-mock';
import {
    ApplePayValidateMerchantError,
    braintreeOnValidateMerchantApple,
    displayError,
    getBraintreeApplePayInstanceChecked,
    getBraintreeApplePaySessionChecked,
    IBraintreeApplePayInstance,
} from 'src';
import {getOrderInitialData} from '@boldcommerce/checkout-frontend-library';
import {orderInitialDataMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import ApplePayValidateMerchantEvent = ApplePayJS.ApplePayValidateMerchantEvent;

jest.mock('src/braintree/manageBraintreeState');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getOrderInitialData');
jest.mock('src/actions/displayError');
const getBraintreeApplePayInstanceCheckedMock = mocked(getBraintreeApplePayInstanceChecked, true);
const getBraintreeApplePaySessionCheckedMock = mocked(getBraintreeApplePaySessionChecked, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const displayErrorMock = mocked(displayError, true);

describe('testing braintreeOnValidateMerchantApple function',() => {
    const errorMessage = 'Some Error Message';
    const validationURL = 'test.com';
    const displayErrorMsg = 'There was an error while loading Apple Pay.';
    const displayName = orderInitialDataMock.shop_name;
    const performValidation = jest.fn();
    const completeMerchantValidation = jest.fn();
    const abort = jest.fn();
    const appleInstance = {performValidation} as unknown as IBraintreeApplePayInstance;
    const appleSession = {completeMerchantValidation, abort} as unknown as ApplePaySession;
    const eventMock = {validationURL} as ApplePayValidateMerchantEvent;

    beforeEach(() => {
        jest.resetAllMocks();
        getBraintreeApplePayInstanceCheckedMock.mockReturnValue(appleInstance);
        getBraintreeApplePaySessionCheckedMock.mockReturnValue(appleSession);
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
        performValidation.mockReturnValue({testing:true});
    });

    test('call successfully',async () => {
        await braintreeOnValidateMerchantApple(eventMock).then(() => {
            expect(getBraintreeApplePayInstanceCheckedMock).toBeCalledTimes(1);
            expect(getBraintreeApplePaySessionCheckedMock).toBeCalledTimes(1);
            expect(getOrderInitialDataMock).toBeCalledTimes(1);
            expect(performValidation).toBeCalledTimes(1);
            expect(performValidation).toBeCalledWith({validationURL, displayName});
            expect(completeMerchantValidation).toBeCalledTimes(1);
            expect(completeMerchantValidation).toBeCalledWith({testing:true});
        });
    });

    const errorData = [
        {
            name: 'call when throw error as instance of Error inside try catch',
            errorMock: new Error(errorMessage),
            expectedError: new ApplePayValidateMerchantError(errorMessage),
        },
        {
            name: 'call when throw error as string inside try catch',
            errorMock: 'errors test',
            expectedError: new ApplePayValidateMerchantError('Error validating merchant: errors test'),
        },
        {
            name: 'call when throw error as undefined inside try catch',
            errorMock: undefined,
            expectedError: new ApplePayValidateMerchantError('Error validating merchant: undefined'),
        },
    ];

    test.each(errorData)('$name',async ({errorMock, expectedError}) => {
        performValidation.mockImplementation(() => {
            throw errorMock;
        });

        await braintreeOnValidateMerchantApple(eventMock).then(() => {
            expect('This expect should not run, call should Throw').toBe(null);
        }).catch((e) => {
            expect(e).toStrictEqual(expectedError);
            expect(getBraintreeApplePayInstanceCheckedMock).toBeCalledTimes(1);
            expect(getBraintreeApplePaySessionCheckedMock).toBeCalledTimes(1);
            expect(getOrderInitialDataMock).toBeCalledTimes(1);
            expect(performValidation).toBeCalledTimes(1);
            expect(performValidation).toBeCalledWith({validationURL, displayName});
            expect(completeMerchantValidation).toBeCalledTimes(0);
            expect(displayErrorMock).toBeCalledTimes(1);
            expect(displayErrorMock).toBeCalledWith(displayErrorMsg, 'generic', 'unknown_error');
            expect(abort).toBeCalledTimes(1);
        });
    });
});
