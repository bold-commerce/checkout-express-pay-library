import {
    alternatePaymentMethodType,
    getOrderInitialData,
    IExpressPayBraintree,
    IExpressPayBraintreeApple,
    IExpressPayBraintreeGoogle,
    IExpressPayPaypal
} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {initialize, initStripe, initPaypal, setOnAction, initBraintreeGoogle, initBraintreeApple} from 'src';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('src/initialize/manageExpressPayContext');
jest.mock('src/stripe/initStripe');
jest.mock('src/paypal/initPaypal');
jest.mock('src/braintree/google/initBraintreeGoogle');
jest.mock('src/braintree/apple/initBraintreeApple');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const setOnActionMock = mocked(setOnAction, true);
const initStripeMock = mocked(initStripe, true);
const initPaypalMock = mocked(initPaypal, true);
const initBraintreeGoogleMock = mocked(initBraintreeGoogle, true);
const initBraintreeAppleMock = mocked(initBraintreeApple, true);

describe('testing initialize function', () => {
    let consoleSpy: jest.SpyInstance;
    const onActionMock = jest.fn();
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
        alternative_payment_methods: []
    };
    const braintreePayment: IExpressPayBraintree = {
        type: alternatePaymentMethodType.BRAINTREE_GOOGLE,
        public_id: 'somePublicId',
        is_test: true,
        merchant_account: 'someMerchantAccount',
        tokenization_key: 'someTokenizationKey',
        button_style: {}
    };

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(jest.fn());
    });

    test('testing with empty payment options', () => {
        getOrderInitialDataMock.mockReturnValueOnce(initData);
        initialize({onAction: onActionMock});
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
        const orderInitData = {...initData, alternative_payment_methods: [stripe]};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize({onAction: onActionMock});
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        expect(initStripeMock).toHaveBeenCalledTimes(1);
        expect(initStripeMock).toHaveBeenCalledWith(stripe);
        expect(setOnActionMock).toHaveBeenCalledTimes(1);
    });

    test('testing with paypal payment options', () => {
        const paypalPayment: IExpressPayPaypal = {
            type: alternatePaymentMethodType.PAYPAL,
            is_test: true,
            client_id: 'someClientId',
            button_style: {},
            public_id: 'somePublicId',
        };

        const orderInitData = {...initData, alternative_payment_methods: [paypalPayment]};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize({onAction: onActionMock});
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        expect(initPaypalMock).toHaveBeenCalledTimes(1);
        expect(initPaypalMock).toHaveBeenCalledWith(paypalPayment);
        expect(setOnActionMock).toHaveBeenCalledTimes(1);
    });

    test('testing with braintree payment options', () => {
        const braintreePaymentGoogle: IExpressPayBraintreeGoogle = {
            ...braintreePayment,
            google_pay_enabled: true,
            google_pay_merchant_identifier: 'someGooglePayMerchantIdentifier',
            apiVersion: 'someApiVersion',
            sdkVersion: 'someSdkVersion',
            merchantId: 'someMerchantId',
        };

        const orderInitData = {...initData, alternative_payment_methods: [braintreePaymentGoogle]};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize({onAction: onActionMock});
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        expect(initBraintreeGoogleMock).toHaveBeenCalledTimes(1);
        expect(initBraintreeGoogleMock).toHaveBeenCalledWith(braintreePaymentGoogle);
        expect(setOnActionMock).toHaveBeenCalledTimes(1);
    });

    test('testing with braintree-apple payment options', () => {
        const braintreePaymentApple: IExpressPayBraintreeApple = {
            ...braintreePayment,
            type: alternatePaymentMethodType.BRAINTREE_APPLE,
            apple_pay_enabled: true
        };

        const orderInitData = {...initData, alternative_payment_methods: [braintreePaymentApple]};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize({onAction: onActionMock});
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        expect(initBraintreeAppleMock).toHaveBeenCalledTimes(1);
        expect(initBraintreeAppleMock).toHaveBeenCalledWith(braintreePaymentApple);
        expect(setOnActionMock).toHaveBeenCalledTimes(1);
    });

    test('testing with default option', () => {
        const stripe = {
            type: '',
            key: '',
            stripe_user_id: '',
            public_id: '',
            account_country: ''
        };
        const orderInitData = {...initData, alternative_payment_methods: [stripe]};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize({onAction: onActionMock});
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith('do nothing');

    });
});
