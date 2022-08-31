import {OnApproveActions} from '@paypal/paypal-js/types/components/buttons';
import {paypalOnApprove} from 'src';

const onApproveActionsMock: OnApproveActions = {redirect: jest.fn(), restart: jest.fn()};

describe('testing  paypalOnApprove function', () => {

    test('testing call paypalOnApprove success', async () => {
        // TODO Complete test when Implemented, this is just a place holder and coverage.
        await paypalOnApprove({orderID: '', facilitatorAccessToken: ''}, onApproveActionsMock);
    });

});
