import {OnShippingChangeActions, OnShippingChangeData} from '@paypal/paypal-js/types/components/buttons';
import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    IWalletPayOnShippingResponse,
    walletPayOnShipping,

} from '@boldcommerce/checkout-frontend-library';
import {applicationStateMock,} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {paypalOnShippingChange} from 'src';

jest.mock('@boldcommerce/checkout-frontend-library/lib/walletPay/walletPayOnShipping');
const walletPayOnShippingMock = mocked(walletPayOnShipping, true);

describe('testing  paypalOnShippingChange function', () => {
    const dataMock: OnShippingChangeData = {
        forceRestAPI: true,
        shipping_address : {city: 'Winnipeg', state: 'MB', country_code: 'CA', postal_code: 'R3Y0L6'},
        selected_shipping_option : {
            label: 'test shipping',
            type: 'SHIPPING',
            amount: {currency_code: 'CAD', value: '1.00'}
        },
    };

    const actionMock: OnShippingChangeActions = {
        resolve: jest.fn().mockReturnValue(Promise.resolve()),
        reject: jest.fn().mockReturnValue(Promise.resolve()),
        order: {
            patch: jest.fn().mockReturnValue(Promise.resolve({id: '123'}))
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('testing with successful call', async () => {
        const response: IWalletPayOnShippingResponse = {
            payment_data: {
            },
            application_state: applicationStateMock
        };

        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = true;
        paymentReturn.response = {data: response};
        walletPayOnShippingMock.mockReturnValue(Promise.resolve(paymentReturn));

        await paypalOnShippingChange(dataMock, actionMock);
        expect(walletPayOnShippingMock).toHaveBeenCalledTimes(1);
        expect(actionMock.reject).toHaveBeenCalledTimes(0);
    });


    test('testing with unsuccessful call', async () => {
        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = false;
        walletPayOnShippingMock.mockReturnValue(Promise.resolve(paymentReturn));

        await paypalOnShippingChange(dataMock, actionMock);
        expect(walletPayOnShippingMock).toHaveBeenCalledTimes(1);
        expect(actionMock.reject).toHaveBeenCalledTimes(1);
    });


});
