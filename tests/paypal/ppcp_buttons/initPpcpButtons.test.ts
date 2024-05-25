/* eslint-disable @typescript-eslint/no-explicit-any */
import {mocked} from 'jest-mock';
import {
    alternatePaymentMethodType,
    getCurrency,
    getEnvironment,
    getJwtToken,
    getPublicOrderId,
    getShopIdentifier,
    IExpressPayPaypalCommercePlatformButton
} from '@boldcommerce/checkout-frontend-library';
import {currencyMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {getPaypalNameSpace, getPaypalNameSpacePromise, hasPaypalNameSpace, initPpcpButtons, ppcpOnLoad, setPaypalGatewayPublicId, setPaypalNameSpace} from 'src';
import {loadScript, PayPalNamespace} from '@paypal/paypal-js';

jest.mock('@paypal/paypal-js');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('src/paypal/managePaypalState');
jest.mock('src/paypal/ppcp_buttons/ppcpOnLoad');
jest.mock('@boldcommerce/checkout-frontend-library', () => ({
    ...jest.requireActual('@boldcommerce/checkout-frontend-library'),
    getEnvironment: jest.fn(),
    getJwtToken: jest.fn(),
    getPublicOrderId: jest.fn(),
    getShopIdentifier: jest.fn(),
}));
const getCurrencyMock = mocked(getCurrency, true);
const hasPaypalNameSpaceMock = mocked(hasPaypalNameSpace, true);
const loadScriptMock = mocked(loadScript, true);
const paypalOnloadMock = mocked(ppcpOnLoad, true);
const setPaypalNameSpaceMock = mocked(setPaypalNameSpace, true);
const getPaypalNameSpaceMock = mocked(getPaypalNameSpace, true);
const getPaypalNameSpacePromiseMock = mocked(getPaypalNameSpacePromise, true);
const getEnvironmentMock = mocked(getEnvironment);
const getJwtTokenMock = mocked(getJwtToken);
const getPublicOrderIdMock = mocked(getPublicOrderId);
const getShopIdentifierMock = mocked(getShopIdentifier);

describe('testing initPpcpButtons function', () => {
    let fetchActual: typeof global.fetch;
    const fetchMock = jest.fn();
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
        jest.resetAllMocks();
        getCurrencyMock.mockReturnValue(currencyMock);
        hasPaypalNameSpaceMock.mockReturnValue(false);
        loadScriptMock.mockReturnValue(loadScriptReturn);
        fetchActual = global.fetch;
        global.fetch = fetchMock;
    });

    afterEach(() => {
        global.fetch = fetchActual;
    });

    test('testing call initPpcpButtons', async () => {
        let paypal: any;
        setPaypalNameSpaceMock.mockImplementation(p => paypal = p);
        getPaypalNameSpaceMock.mockImplementation(() => paypal);
        hasPaypalNameSpaceMock.mockImplementation(() => !!paypal);

        await initPpcpButtons(paypalPayment);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledWith(paypalPayment.public_id);
        expect(loadScriptMock).toHaveBeenCalledTimes(1);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(1);

    });

    test('testing call initPpcpButtons null paypal name space', async () => {
        loadScriptMock.mockReturnValueOnce(Promise.resolve(null));
        hasPaypalNameSpaceMock.mockReturnValue(false);
        const paypal = {...paypalPayment , is_dev: false};
        await initPpcpButtons(paypal, false);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledWith(paypalPayment.public_id);
        expect(loadScriptMock).toHaveBeenCalledTimes(1);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(0);
    });

    test('testing call initPpcpButtons non-null paypal name space promise', async () => {
        loadScriptMock.mockReturnValueOnce(Promise.resolve(null));
        hasPaypalNameSpaceMock.mockReturnValueOnce(false);
        hasPaypalNameSpaceMock.mockReturnValueOnce(true);
        getPaypalNameSpacePromiseMock.mockReturnValue(Promise.resolve() as any);
        const paypal = {...paypalPayment , is_dev: false};
        await initPpcpButtons(paypal);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledWith(paypalPayment.public_id);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(1);
    });

    test('testing call initPpcpButtons has paypal name space', async () => {
        hasPaypalNameSpaceMock.mockReturnValue(true);

        await initPpcpButtons(paypalPayment);

        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledWith(paypalPayment.public_id);
        expect(loadScriptMock).toHaveBeenCalledTimes(0);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(1);
    });

    test('testing call initPpcpButtons fastlane', async () => {
        let paypal: any;
        setPaypalNameSpaceMock.mockImplementation(p => paypal = p);
        getPaypalNameSpaceMock.mockImplementation(() => paypal);
        hasPaypalNameSpaceMock.mockImplementation(() => !!paypal);

        getEnvironmentMock.mockReturnValue({path: '/path', type: 'testing', url: 'https://test.com'});
        getJwtTokenMock.mockReturnValue('jwt');
        getPublicOrderIdMock.mockReturnValue('id');
        getShopIdentifierMock.mockReturnValue('shop_id');
        fetchMock.mockResolvedValue({
            json: () => Promise.resolve({data: {client_token: 'token'}}),
        });

        await initPpcpButtons(paypalPayment, true);

        expect(loadScriptMock).toHaveBeenCalledTimes(1);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(1);
    });
});
