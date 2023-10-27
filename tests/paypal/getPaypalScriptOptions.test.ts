import {getCurrency} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {currencyMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {getPaypalScriptOptions} from 'src';
import {PayPalScriptOptions} from '@paypal/paypal-js/types/script-options';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
const getCurrencyMock = mocked(getCurrency, true);

describe('testing getPaypalScriptOptions function', () => {
    const clientId = 'some-client-id';
    const isDebug = false;

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
    });

    test('testing call getPaypalScriptOptions', async () => {
        const expectation: PayPalScriptOptions = {
            'clientId': clientId,
            'debug': isDebug,
            'currency': 'USD',
            'disableFunding': 'credit,card,venmo,sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort',
            'vault': 'true',
            'intent': 'authorize',
            'integrationDate': '2020-03-10',
            'merchantId': undefined,
            'components': undefined,
        };

        const result = getPaypalScriptOptions(clientId, isDebug);

        expect(result).toStrictEqual(expectation);
    });

});
