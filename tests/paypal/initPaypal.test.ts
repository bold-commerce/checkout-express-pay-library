import {
    getCurrency,
    alternatePaymentMethodType,
    IExpressPayPaypal,
} from '@bold-commerce/checkout-frontend-library';
import {getPaypalUrl, initPaypal, paypalOnload} from 'src';
import {mocked} from 'jest-mock';
import {currencyMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('src/paypal/getPaypalUrl');
jest.mock('src/paypal/paypalOnload');
const getCurrencyMock = mocked(getCurrency, true);
const getPaypalUrlMock = mocked(getPaypalUrl, true);
const paypalOnloadMock = mocked(paypalOnload, true);

describe('testing initPaypal function', () => {
    const showHideMock = jest.fn();
    const event = new Event('test');
    const paypalPayment: IExpressPayPaypal = {
        type: alternatePaymentMethodType.PAYPAL,
        is_test: true,
        client_id: 'someClientId',
        button_style: {},
        public_id: 'somePublicId',
    };
    const paypalUrlMock = 'https://www.paypal.com/sdk/js?param=paramValue';

    beforeEach(() => {
        jest.clearAllMocks();
        getPaypalUrlMock.mockReturnValue(paypalUrlMock);
        getCurrencyMock.mockReturnValue(currencyMock);
    });

    test('testing call initPaypal add script and loads', () => {
        initPaypal(paypalPayment, showHideMock);

        expect(getCurrencyMock).toHaveBeenCalledTimes(1);
        expect(getPaypalUrlMock).toHaveBeenCalledTimes(1);
        expect(getPaypalUrlMock).toHaveBeenCalledWith(paypalPayment.client_id, paypalPayment.is_test, currencyMock.iso_code);
        const qryScriptElement: NodeListOf<HTMLScriptElement> = document.querySelectorAll('script[data-namespace=paypal_direct]');
        expect(qryScriptElement.length).toBe(1);
        const scriptElement: HTMLScriptElement = qryScriptElement[0];
        expect(scriptElement.src).toBe(paypalUrlMock);
        expect(typeof scriptElement.onload).toBe('function');
        scriptElement?.onload && scriptElement.onload(event);
        expect(paypalOnloadMock).toHaveBeenCalledTimes(1);
        expect(paypalOnloadMock).toHaveBeenCalledWith(paypalPayment, showHideMock);
    });
});
