import {mocked} from 'jest-mock';
import {
    alternatePaymentMethodType,
    getCurrency,
    IExpressPayPaypalCommercePlatformButton
} from '@boldcommerce/checkout-frontend-library';
import {currencyMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {hasPaypalNameSpace, initPpcpButtons, ppcpOnLoad, setPaypalGatewayPublicId} from 'src';
import {loadScript, PayPalNamespace} from '@paypal/paypal-js';

jest.mock('@paypal/paypal-js');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('src/paypal/managePaypalState');
jest.mock('src/paypal/ppcp_buttons/ppcpOnLoad');
const getCurrencyMock = mocked(getCurrency, true);
const hasPaypalNameSpaceMock = mocked(hasPaypalNameSpace, true);
const loadScriptMock = mocked(loadScript, true);
const paypalOnloadMock = mocked(ppcpOnLoad, true);

describe('testing initPpcpButtons function', () => {

    const paypalPayment: IExpressPayPaypalCommercePlatformButton = {
        type: alternatePaymentMethodType.PPCP,
        is_dev: true,
        merchant_id: 'someClientId',
        partner_id: 'somePartnerId',
        style: {shape: 'rect', color: 'blue'},
        merchant_country: 'US',
        payment_types: {
            paypal: true,
            paylater: true,
            venmo: false,
            paylaterMessages: true
        },
        is_3ds_enabled: false,
        apple_pay_enabled: false,
        public_id: 'somePublicId',
    };
    const paypalNameSpaceMock: PayPalNamespace = {version: 'test_mock_version'};
    const loadScriptReturn = Promise.resolve(paypalNameSpaceMock);
    const setPaypalGatewayPublicIdMock = mocked(setPaypalGatewayPublicId, true);

    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        hasPaypalNameSpaceMock.mockReturnValue(false);
        loadScriptMock.mockReturnValue(loadScriptReturn);
    });

    test('testing call initPpcpButtons', async () => {

        await initPpcpButtons(paypalPayment);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledWith(paypalPayment.public_id);
        expect(hasPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledTimes(1);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(1);

    });

    test('testing call initPpcpButtons null paypal name space', async () => {
        loadScriptMock.mockReturnValueOnce(Promise.resolve(null));

        await initPpcpButtons(paypalPayment);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledWith(paypalPayment.public_id);
        expect(hasPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledTimes(1);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(0);
    });

    test('testing call initPpcpButtons has paypal name space', async () => {
        hasPaypalNameSpaceMock.mockReturnValueOnce(true);

        await initPpcpButtons(paypalPayment);

        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledWith(paypalPayment.public_id);
        expect(hasPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledTimes(0);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(1);
    });

});
