import mocked = jest.mocked;
import {braintreeOnLoadClient, setBraintreeClient} from 'src';

jest.mock('src/braintree/manageBraintreeState');
const setBraintreeClientMock = mocked(setBraintreeClient, true);

describe('testing braintreeOnLoadClient function', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.window.braintree = undefined;
    });

    test('call with window.braintree', () => {
        global.window.braintree = {test: 'test'};

        braintreeOnLoadClient();

        expect(setBraintreeClientMock).toHaveBeenCalledTimes(1);
        expect(setBraintreeClientMock).toHaveBeenCalledWith({test: 'test'});
    });

    test('call with no window.braintree', () => {
        braintreeOnLoadClient();

        expect(setBraintreeClientMock).toHaveBeenCalledTimes(0);
    });

});
