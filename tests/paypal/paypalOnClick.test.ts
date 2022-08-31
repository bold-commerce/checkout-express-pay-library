import {getRefreshedApplicationState} from '@bold-commerce/checkout-frontend-library';
import {OnClickActions} from '@paypal/paypal-js/types/components/buttons';
import {mocked} from 'jest-mock';
import {paypalOnClick} from 'src';

jest.mock('@bold-commerce/checkout-frontend-library/lib/order/getRefreshedApplicationState');
const getRefreshedApplicationStateMock = mocked(getRefreshedApplicationState, true);
const onClickActionsMock: OnClickActions = {resolve: jest.fn(), reject: jest.fn()};

describe('testing  paypalOnClick function', () => {

    test('testing call paypalOnClick success', async () => {
        await paypalOnClick({}, onClickActionsMock);

        expect(getRefreshedApplicationStateMock).toHaveBeenCalledTimes(1);
        expect(onClickActionsMock.resolve).toHaveBeenCalledTimes(1);
        expect(onClickActionsMock.reject).toHaveBeenCalledTimes(0);
    });

});
