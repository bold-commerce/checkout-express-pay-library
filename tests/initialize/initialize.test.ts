import {mocked} from 'jest-mock';
import {initialize} from 'src';
import {alternatePaymentMethodType, getOrderInitialData} from '@bold-commerce/checkout-frontend-library';


jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);

describe('testing initialize function', () => {

    let consoleSpy: jest.SpyInstance;
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
    });

    test('testing with undefined payment options', () => {
        const orderInitData = {...initData, alternate_payment_methods: undefined};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize();
        expect(consoleSpy).toHaveBeenCalledTimes(0);

    });

    test('testing with empty payment options', () => {
        getOrderInitialDataMock.mockReturnValueOnce(initData);
        initialize();
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
        const orderInitData = {...initData, alternate_payment_methods: [stripe]};
        getOrderInitialDataMock.mockReturnValueOnce(orderInitData);
        initialize();
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith('implement stripe');
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
        initialize();
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith('do nothing');

    });
});
