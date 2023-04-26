import {mocked} from 'jest-mock';
import {
    ApplePayValidateMerchantError,
    ppcpOnValidateMerchantApple,
    displayError,
    getPPCPApplePayInstanceChecked,
    getPPCPApplePaySessionChecked,
    IPPCPApplePayInstance,
} from 'src';
import {getOrderInitialData} from '@bold-commerce/checkout-frontend-library';
import {orderInitialDataMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';
import ApplePayValidateMerchantEvent = ApplePayJS.ApplePayValidateMerchantEvent;

jest.mock('src/paypal/managePaypalState');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getOrderInitialData');
jest.mock('src/actions/displayError');
const getPPCPApplePayInstanceCheckedMock = mocked(getPPCPApplePayInstanceChecked, true);
const getPPCPApplePaySessionCheckedMock = mocked(getPPCPApplePaySessionChecked, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const displayErrorMock = mocked(displayError, true);

describe('testing ppcpOnValidateMerchantApple function',() => {
    const errorMessage = 'Some Error Message';
    const validationURL = 'test.com';
    const displayErrorMsg = 'There was an error while loading Apple Pay.';
    const displayName = orderInitialDataMock.shop_name;
    const validateMerchant = jest.fn();
    const completeMerchantValidation = jest.fn();
    const abort = jest.fn();
    const appleInstance = {validateMerchant} as unknown as IPPCPApplePayInstance;
    const appleSession = {completeMerchantValidation, abort} as unknown as ApplePaySession;
    const eventMock = {validationURL} as ApplePayValidateMerchantEvent;

    beforeEach(() => {
        jest.resetAllMocks();
        getPPCPApplePayInstanceCheckedMock.mockReturnValue(appleInstance);
        getPPCPApplePaySessionCheckedMock.mockReturnValue(appleSession);
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
        validateMerchant.mockReturnValue({testing:true});
    });

    test('call successfully',async () => {
        await ppcpOnValidateMerchantApple(eventMock).then(() => {
            expect(getPPCPApplePayInstanceCheckedMock).toBeCalledTimes(1);
            expect(getPPCPApplePaySessionCheckedMock).toBeCalledTimes(1);
            expect(getOrderInitialDataMock).toBeCalledTimes(1);
            expect(validateMerchant).toBeCalledTimes(1);
            expect(validateMerchant).toBeCalledWith({validationUrl: validationURL, displayName});
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
        validateMerchant.mockImplementation(() => {
            throw errorMock;
        });

        await ppcpOnValidateMerchantApple(eventMock).then(() => {
            expect('This expect should not run, call should Throw').toBe(null);
        }).catch((e) => {
            expect(e).toStrictEqual(expectedError);
            expect(getPPCPApplePayInstanceCheckedMock).toBeCalledTimes(1);
            expect(getPPCPApplePaySessionCheckedMock).toBeCalledTimes(1);
            expect(getOrderInitialDataMock).toBeCalledTimes(1);
            expect(validateMerchant).toBeCalledTimes(1);
            expect(validateMerchant).toBeCalledWith({validationUrl: validationURL, displayName});
            expect(completeMerchantValidation).toBeCalledTimes(0);
            expect(displayErrorMock).toBeCalledTimes(1);
            expect(displayErrorMock).toBeCalledWith(displayErrorMsg, 'generic', 'unknown_error');
            expect(abort).toBeCalledTimes(1);
        });
    });
});
