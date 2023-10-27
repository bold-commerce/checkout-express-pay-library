import {alternatePaymentMethodType, IExpressPayPaypal,} from '@boldcommerce/checkout-frontend-library';
import {
    getPaypalScriptOptions,
    hasPaypalNameSpace,
    initPaypal,
    paypalOnload,
    setPaypalGatewayPublicId,
    setPaypalNameSpace
} from 'src';
import {mocked} from 'jest-mock';
import {loadScript, PayPalNamespace, PayPalScriptOptions} from '@paypal/paypal-js';

jest.mock('@paypal/paypal-js');
jest.mock('src/paypal/getPaypalScriptOptions');
jest.mock('src/paypal/managePaypalState');
jest.mock('src/paypal/paypalOnload');
const getPaypalScriptOptionsMock = mocked(getPaypalScriptOptions, true);
const paypalOnloadMock = mocked(paypalOnload, true);
const hasPaypalNameSpaceMock = mocked(hasPaypalNameSpace, true);
const setPaypalNameSpaceMock = mocked(setPaypalNameSpace, true);
const setPaypalGatewayPublicIdMock = mocked(setPaypalGatewayPublicId, true);
const loadScriptMock = mocked(loadScript, true);

describe('testing initPaypal function', () => {
    const paypalPayment: IExpressPayPaypal = {
        type: alternatePaymentMethodType.PAYPAL,
        is_test: true,
        client_id: 'someClientId',
        button_style: {},
        public_id: 'somePublicId',
    };
    const paypalNameSpaceMock: PayPalNamespace = {version: 'test_mock_version'};
    const loadScriptReturn = Promise.resolve(paypalNameSpaceMock);
    const paypalScriptOptions: PayPalScriptOptions = {
        'clientId': paypalPayment.client_id,
        'debug': paypalPayment.is_test,
        'currency': 'USD',
        'disableFunding': 'credit,card,venmo,sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort',
        'vault': 'true',
        'intent': 'authorize',
        'integrationDate': '2020-03-10'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getPaypalScriptOptionsMock.mockReturnValue(paypalScriptOptions);
        hasPaypalNameSpaceMock.mockReturnValue(false);
        loadScriptMock.mockReturnValue(loadScriptReturn);
    });

    test('testing call initPaypal set paypal name space', async () => {
        await initPaypal(paypalPayment);

        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledWith(paypalPayment.public_id);
        expect(hasPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(getPaypalScriptOptionsMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledWith(paypalScriptOptions);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledWith(paypalNameSpaceMock);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(1);
        expect(paypalOnloadMock).toHaveBeenCalledWith(paypalPayment);
    });

    test('testing call initPaypal null paypal name space', async () => {
        loadScriptMock.mockReturnValueOnce(Promise.resolve(null));

        await initPaypal(paypalPayment);

        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledWith(paypalPayment.public_id);
        expect(hasPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(getPaypalScriptOptionsMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledTimes(1);
        expect(loadScriptMock).toHaveBeenCalledWith(paypalScriptOptions);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledWith(null);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(0);
    });

    test('testing call initPaypal has paypal name space', async () => {
        hasPaypalNameSpaceMock.mockReturnValueOnce(true);

        await initPaypal(paypalPayment);

        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledTimes(1);
        expect(setPaypalGatewayPublicIdMock).toHaveBeenCalledWith(paypalPayment.public_id);
        expect(hasPaypalNameSpaceMock).toHaveBeenCalledTimes(1);
        expect(getPaypalScriptOptionsMock).toHaveBeenCalledTimes(0);
        expect(loadScriptMock).toHaveBeenCalledTimes(0);
        expect(setPaypalNameSpaceMock).toHaveBeenCalledTimes(0);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(1);
    });
});
