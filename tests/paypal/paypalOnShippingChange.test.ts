import {OnShippingChangeActions} from '@paypal/paypal-js/types/components/buttons';
import {paypalOnShippingChange} from 'src';

const onShippingChangeActionsMock: OnShippingChangeActions = {
    resolve: jest.fn(),
    reject: jest.fn(),
    order: {
        patch: jest.fn()
    },
};

describe('testing  paypalOnShippingChange function', () => {

    test('testing call paypalOnShippingChange success', async () => {
        // TODO Complete test when Implemented, this is just a place holder and coverage.
        await paypalOnShippingChange({forceRestAPI: true}, onShippingChangeActionsMock);
    });

});
