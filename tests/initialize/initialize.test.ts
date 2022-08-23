import {
    alternatePaymentMethodType,
    getOrderInitialData,
    IExpressPayPaypal, IExpressPayStripe
} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {initialize, initStripe, initPaypal, showHideExpressPaySection} from 'src';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('src/initialize/showHideExpressPaySection');
jest.mock('src/stripe/initStripe');
jest.mock('src/paypal/initPaypal');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const showHideExpressPaySectionMock = mocked(showHideExpressPaySection, true);
const initStripeMock = mocked(initStripe, true);
const initPaypalMock = mocked(initPaypal, true);

describe('testing initialize function', () => {
    let consoleSpy: jest.SpyInstance;
    const initStripeMockImplementation = (method: IExpressPayStripe, callback?: (show: boolean) => void) => callback && callback(false);
    const initPaypalMockImplementation = (method: IExpressPayPaypal, callback?: (show: boolean) => void) => callback && callback(false);
    const initData = {
        shop_name: 'test_shop_name',
        country_info: [],
        supported_languages: [],
        general_settings: {
            checkout_process: {
                company_name_option: 'required',
                phone_number_required: false,
                accepts_marketing_checkbox_option: 'checked'
            },
            address_autocomplete: {
                provider: null,
                api_key: null
            }
        },
        alternate_payment_methods: []
    };

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(jest.fn());
        initStripeMock.mockImplementation(initStripeMockImplementation);
        initPaypalMock.mockImplementation(initPaypalMockImplementation);
    });

    test('testing with undefined payment options', () => {
        const orderInitData = {...initData, alternate_payment_methods: undefined};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize({});
        expect(consoleSpy).toHaveBeenCalledTimes(0);

    });

    test('testing with empty payment options', () => {
        getOrderInitialDataMock.mockReturnValueOnce(initData);
        initialize({});
        expect(consoleSpy).toHaveBeenCalledTimes(0);

    });

    test('testing with stripe payment options', () => {
        const stripe = {
            type: alternatePaymentMethodType.STRIPE,
            key: '',
            stripe_user_id: '',
            public_id: '',
            account_country: ''
        };
        const showHideExpressPaymentSection = jest.fn();
        const orderInitData = {...initData, alternate_payment_methods: [stripe]};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize({showHideExpressPaymentSection});
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        expect(initStripeMock).toHaveBeenCalledTimes(1);
        expect(initStripeMock).toHaveBeenCalledWith(stripe, expect.any(Function));
        expect(showHideExpressPaySectionMock).toHaveBeenCalledTimes(1);
    });

    test('testing with paypal payment options', () => {
        const paypalPayment: IExpressPayPaypal = {
            type: alternatePaymentMethodType.PAYPAL,
            is_test: true,
            client_id: 'someClientId',
            button_style: {},
            public_id: 'somePublicId',
        };
        const showHideExpressPaymentSection = jest.fn();
        const orderInitData = {...initData, alternate_payment_methods: [paypalPayment]};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize({showHideExpressPaymentSection});
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        expect(initPaypalMock).toHaveBeenCalledTimes(1);
        expect(initPaypalMock).toHaveBeenCalledWith(paypalPayment, expect.any(Function));
        expect(showHideExpressPaySectionMock).toHaveBeenCalledTimes(1);
    });

    test('testing with default option', () => {
        const stripe = {
            type: '',
            key: '',
            stripe_user_id: '',
            public_id: '',
            account_country: ''
        };
        const orderInitData = {...initData, alternate_payment_methods: [stripe]};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize({});
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith('do nothing');

    });
});
