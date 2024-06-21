/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
import {mocked} from 'jest-mock';
import {
    getCurrency,
    getOrderInitialData,
    addPayment,
    batchRequest,
    estimateShippingLines,
    getLineItems,
    getCustomer,
    IShippingLine,
} from '@boldcommerce/checkout-frontend-library';
import {
    displayError,
    enableDisableSection,
    orderProcessing
} from 'src/actions';
import {
    getPaypalNameSpace,
    setPaypalNameSpace,
    paypalOnClick
} from 'src/paypal';
import {getTotals, loadJS} from 'src/utils';
import {showPaymentMethodTypes} from 'src/variables';
import {braintreeOnLoadClient, getBraintreeClient, getBraintreeJsUrls, initBraintreePayPalButtons, TokenizePaymentResult} from 'src';
import {CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData, OnShippingChangeActions, OnShippingChangeData, OnShippingOptionsChangeActions, PayPalNamespace} from '@paypal/paypal-js';

// Mocking '@boldcommerce/checkout-frontend-library'
jest.mock('@boldcommerce/checkout-frontend-library', () => {
    const actualModule = jest.requireActual('@boldcommerce/checkout-frontend-library');
    return {
        ...actualModule,
        getCurrency: jest.fn(),
        getOrderInitialData: jest.fn(),
        addPayment: jest.fn(),
        batchRequest: jest.fn(),
        estimateShippingLines: jest.fn(),
        getLineItems: jest.fn(),
        getCustomer: jest.fn()
    } as typeof import('@boldcommerce/checkout-frontend-library');
});

// Mocking 'src/paypal'
jest.mock('src/paypal', () => {
    const actualModule = jest.requireActual('src/paypal');
    return {
        ...actualModule,
        getPaypalNameSpace: jest.fn(),
        setPaypalNameSpace: jest.fn(),
        paypalOnClick: jest.fn()
    };
});

// Mocking 'src/utils'
jest.mock('src/utils', () => {
    const actualModule = jest.requireActual('src/utils');
    return {
        ...actualModule,
        getTotals: jest.fn(),
        loadJS: jest.fn()
    };
});

jest.mock('src/actions/orderProcessing');
jest.mock('src/actions/enableDisableSection');
jest.mock('src/actions/displayError');
jest.mock('src/braintree/braintreeOnLoadClient');
jest.mock('src/braintree/getBraintreeJsUrls');
jest.mock('src/braintree/manageBraintreeState', () => {
    const actualModule = jest.requireActual('src/braintree/manageBraintreeState');
    return {
        ...actualModule,
        getBraintreeClient: jest.fn(),
    };
});

// Creating mocked variables
const getCurrencyMock = mocked(getCurrency, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const addPaymentMock = mocked(addPayment, true);
const batchRequestMock = mocked(batchRequest, true);
const estimateShippingLinesMock = mocked(estimateShippingLines, true);
const getLineItemsMock = mocked(getLineItems, true);
const getCustomerMock = mocked(getCustomer, true);

const displayErrorMock = mocked(displayError, true);
const enableDisableSectionMock = mocked(enableDisableSection, true);
const orderProcessingMock = mocked(orderProcessing, true);

const getPaypalNameSpaceMock = mocked(getPaypalNameSpace, true);
const setPaypalNameSpaceMock = mocked(setPaypalNameSpace, true);
const paypalOnClickMock = mocked(paypalOnClick, true);

const getTotalsMock = mocked(getTotals, true);
const loadJSMock = mocked(loadJS, true);

const showPaymentMethodTypesMock = mocked(showPaymentMethodTypes, true);

const braintreeOnLoadClientMock = mocked(braintreeOnLoadClient, true);
const getBraintreeJsUrlsMock = mocked(getBraintreeJsUrls, true);
const getBraintreeClientMock = mocked(getBraintreeClient, true);

describe('testing initBraintreePayPalButtons function', () => {
    const braintreeClientMock = {
        client: {create: jest.fn()},
        applePay: {create: jest.fn()},
        googlePayment: {create: jest.fn()},
        dataCollector: {create: jest.fn()},
        fastlane: {create: jest.fn()},
        paypalCheckout: {create: jest.fn()},
    };
    let paypal: PayPalNamespace;
    let paypalCheckoutInstance: Record<string, any>;

    beforeEach(() => {
        jest.resetAllMocks();
        window.paypal = paypal = {
            version: '',
            Buttons: jest.fn(),
        };

        document.getElementsByTagName('html')[0].innerHTML = '<body></body>';
        const expressPayContainer = document.createElement('div');
        expressPayContainer.id = 'express-payment-container';
        document.body.appendChild(expressPayContainer);

        getPaypalNameSpaceMock.mockReturnValue(paypal);
        getCurrencyMock.mockReturnValue({iso_code: 'CAD'} as any);
        getBraintreeClientMock.mockReturnValue(braintreeClientMock);
        getBraintreeJsUrlsMock.mockReturnValue({
            clientJsURL: 'clientJsURL',
            dataCollectorJsURL: 'dataCollectorJsURL',
            paypalCheckoutURL: 'paypalCheckoutURL',
        } as any);
        braintreeClientMock.paypalCheckout.create.mockResolvedValue(paypalCheckoutInstance = {
            loadPayPalSDK: jest.fn().mockResolvedValue(undefined),
        });
    });

    test('init buttons correctly', async () => {
        // Arranging
        const paypalMock = mocked(paypal, true);
        const renderMock = jest.fn().mockResolvedValue(undefined);
        paypalMock.Buttons?.mockReturnValue({
            isEligible: () => true,
            render: renderMock,
        } as any);

        // Acting
        await initBraintreePayPalButtons({is_paylater_enabled: true} as any);

        // Asserting
        expect(loadJS).toBeCalledWith('clientJsURL');
        expect(loadJS).toBeCalledWith('dataCollectorJsURL');
        expect(loadJS).toBeCalledWith('paypalCheckoutURL');
        expect(enableDisableSection).toBeCalledWith(showPaymentMethodTypes.PPCP, true);
        expect(renderMock).toBeCalledWith('#ppcp-paypal-express-payment-button');
        expect(renderMock).toBeCalledWith('#ppcp-paylater-express-payment-button');
        expect(paypalMock.Buttons).toBeCalledWith(expect.objectContaining({
            fundingSource: 'paypal',
        }));
        expect(paypalMock.Buttons).toBeCalledWith(expect.objectContaining({
            fundingSource: 'paylater',
        }));
    });

    test.each([
        {button: 'paypal', requiresShipping: true},
        {button: 'paylater', requiresShipping: true},
        {button: 'paypal', requiresShipping: false},
        {button: 'paylater', requiresShipping: false},
    ] as const)('creates payment correctly: button=$button,requires_shipping=$requiresShipping', async ({ button, requiresShipping }) => {
        // Arranging
        const paypalMock = mocked(paypal, true);
        paypalMock.Buttons?.mockReturnValue({
            isEligible: () => true,
            render: () => Promise.resolve(),
        } as any);
        getTotalsMock.mockReturnValue({totalAmountDue: 1001} as any);
        getLineItemsMock.mockReturnValue([{product_data: {requires_shipping: requiresShipping}} as any]);
        const actions: any = {
            resolve: jest.fn(),
            reject: jest.fn(),
        };
        paypalCheckoutInstance.createPayment = jest.fn().mockReturnValue(Promise.resolve('test'));

        // Acting
        await initBraintreePayPalButtons({is_paylater_enabled: true} as any);
        const buttonInstance = paypalMock.Buttons!.mock.calls.find(c => c[0]!.fundingSource === button)![0]!;
        const actualToken = await buttonInstance.createOrder!({} as any, actions);

        // Asserting
        expect(actualToken).toBe('test');
        expect(paypalCheckoutInstance.createPayment).toBeCalledWith(expect.objectContaining({
            currency: 'CAD',
            flow: 'checkout',
            amount: '10.01',
            intent: 'authorize',
            requestBillingAgreement: true,
            enableShippingAddress: requiresShipping,
            shippingOptions: [],
        }));
    });

    test.each([
        {button: 'paypal', selectedShipping: undefined},
        {button: 'paylater', selectedShipping: undefined},
        {button: 'paypal', selectedShipping: '1'},
        {button: 'paylater', selectedShipping: '1'},
    ] as const)('handles shipping change correctly: button=$button,selectedShipping=$selectedShipping', async ({ button, selectedShipping }) => {
        // Arranging
        const paypalMock = mocked(paypal, true);
        const actions = {
            resolve: jest.fn(),
            reject: jest.fn(),
        } as const;
        const data = {
            paymentID: 'paymentID',
            shipping_address: {
                city: 'city',
                country_code: 'CA',
                postal_code: 'R3Y 0L6',
                state: 'MB',
            },
        };
        paypalMock.Buttons?.mockReturnValue({
            isEligible: () => true,
            render: () => Promise.resolve(),
        } as any);
        getTotalsMock.mockReturnValue({totalAmountDue: 1001} as any);
        estimateShippingLinesMock.mockResolvedValue({
            success: true,
            response: {
                data: {
                    application_state: {
                        shipping: {
                            selected_shipping: selectedShipping ? {id: selectedShipping} : undefined,
                            available_shipping_lines: [
                                {
                                    id: '0',
                                    amount: 100,
                                    description: '',
                                },
                                {
                                    id: '1',
                                    amount: 100,
                                    description: '',
                                },
                            ] as IShippingLine[],
                        },
                    },
                },
            },
        } as any);
        getTotalsMock.mockReturnValue({totalAmountDue: 1001} as any);
        paypalCheckoutInstance.updatePayment = jest.fn().mockReturnValue(Promise.resolve('test'));

        // Acting
        await initBraintreePayPalButtons({is_paylater_enabled: true} as any);
        const buttonInstance = paypalMock.Buttons!.mock.calls.find(c => c[0]!.fundingSource === button)![0]!;
        await buttonInstance.onShippingChange!(data as any, actions as any);

        // Asserting
        expect(actions.reject).not.toBeCalled();
        expect(actions.resolve).toBeCalled();
        expect(paypalCheckoutInstance.updatePayment).toBeCalledWith(expect.objectContaining({
            paymentId: data.paymentID as string,
            currency: 'CAD',
            amount: '10.01',
            shippingOptions: [
                {
                    id: '0', 
                    label: '',
                    selected: [undefined, '0'].includes(selectedShipping),
                    amount: {
                        value: '1.00',
                        currency: 'CAD',
                    },
                    type: 'SHIPPING',
                },
                {
                    id: '1', 
                    label: '',
                    selected: selectedShipping === '1',
                    amount: {
                        value: '1.00',
                        currency: 'CAD',
                    },
                    type: 'SHIPPING',
                }
            ],
        }));
        expect(estimateShippingLinesMock).toBeCalledWith({
            country_code: data.shipping_address.country_code,
            city: data.shipping_address.city,
            province_code: data.shipping_address.state,
            postal_code: data.shipping_address.postal_code,
        });
    });

    test.each((() => {
        const tests: any[] = [];
        const baseExpectedBatch = [
            {
                apiType: 'updateCustomer',
                payload: {
                    first_name: 'First',
                    last_name: 'Last',
                    email_address: 'email@example.com',
                    email: 'email@example.com',
                    accepts_marketing: false,
                }
            },
            {
                apiType: 'setShippingAddress',
                payload: {
                    first_name: 'Test',
                    last_name: 'McTesterson Person',
                    address_line_1: 'line1',
                    address_line_2: 'line2',
                    business_name: '',
                    city: 'city',
                    country:'Canada',
                    country_code: 'CA',
                    province: 'Manitoba',
                    province_code: 'MB',
                    phone_number: 'phone',
                    postal_code: 'R0A0T0',
                },
            },
            {
                apiType: 'setBillingAddress',
                payload: {
                    first_name: 'First',
                    last_name: 'Last',
                    address_line_1: 'line1',
                    address_line_2: 'line2',
                    business_name: '',
                    city: 'city',
                    country:'Canada',
                    country_code: 'CA',
                    province: 'Manitoba',
                    province_code: 'MB',
                    phone_number: 'phone',
                    postal_code: 'R0A0T0',
                },
            },
            {
                apiType: 'changeShippingLines',
                payload: {
                    index: '0',
                },
            },
            {
                apiType: 'setTaxes',
                payload: {},
            }
        ];
        const onApproveData = {
            orderID: '',
            facilitatorAccessToken: '',
            payerID: 'payerID',
            billingToken: 'billingToken',
            paymentID: 'paymentID',
        };

        tests.push({
            name: 'on approve with shipping',
            expectedBatch: baseExpectedBatch,
            onApproveData,
            getCustomerResult: {platform_id: null},
            orderData: {
                purchase_units: [{
                    shipping: {
                        options: [{
                            id: '0',
                            selected: true,
                        }],
                    }
                }],
            },
            tokenizePaymentResult: {
                nonce: 'nonce',
                details: {
                    firstName: 'First',
                    lastName: 'Last',
                    email: 'email@example.com',
                    phone: 'phone',
                    billingAddress: {
                        city: 'city',
                        countryCode: 'CA',
                        line1: 'line1',
                        line2: 'line2',
                        postalCode: 'R0A0T0',
                        state: 'MB',
                    },
                    shippingAddress: {
                        city: 'city',
                        recipientName: 'Test McTesterson Person',
                        countryCode: 'CA',
                        line1: 'line1',
                        line2: 'line2',
                        postalCode: 'R0A0T0',
                        state: 'MB',
                    },
                },
            },
            expectedTokenizeArguments: {
                payerId: onApproveData.payerID,
                billingToken: onApproveData.billingToken,
                paymentId: onApproveData.paymentID,
                vault: false,
            },
        });

        tests.push({
            name: 'on approve without shipping',
            expectedBatch: baseExpectedBatch.filter(b => !b.apiType.toLowerCase().includes('shipping')),
            onApproveData,
            orderData: {
                purchase_units: [{}],
            },
            getCustomerResult: undefined,
            tokenizePaymentResult: {
                nonce: 'nonce',
                details: {
                    firstName: 'First',
                    lastName: 'Last',
                    email: 'email@example.com',
                    phone: 'phone',
                    billingAddress: {
                        city: 'city',
                        countryCode: 'CA',
                        line1: 'line1',
                        line2: 'line2',
                        postalCode: 'R0A0T0',
                        state: 'MB',
                    },
                },
            },
            expectedTokenizeArguments: {
                payerId: onApproveData.payerID,
                billingToken: onApproveData.billingToken,
                paymentId: onApproveData.paymentID,
                vault: false,
            },
        });

        tests.push({
            name: 'on approve without shipping & with authenticated customer',
            expectedBatch: baseExpectedBatch
                .filter(b => !b.apiType.toLowerCase().includes('shipping'))
                .filter(b => b.apiType !== 'updateCustomer'),
            onApproveData,
            orderData: {
                purchase_units: [{}],
            },
            getCustomerResult: {platform_id: '1'},
            tokenizePaymentResult: {
                nonce: 'nonce',
                details: {
                    firstName: 'First',
                    lastName: 'Last',
                    email: 'email@example.com',
                    phone: 'phone',
                    billingAddress: {
                        city: 'city',
                        countryCode: 'CA',
                        line1: 'line1',
                        line2: 'line2',
                        postalCode: 'R0A0T0',
                        state: 'MB',
                    },
                },
            },
            expectedTokenizeArguments: {
                payerId: onApproveData.payerID,
                billingToken: onApproveData.billingToken,
                paymentId: onApproveData.paymentID,
                vault: false,
            },
        });

        tests.push({
            name: 'nullish coverage',
            expectedBatch: baseExpectedBatch.map(b => !b.apiType.includes('ingAddress') ? b : {
                ...b,
                payload: {
                    ...b.payload,
                    address_line_2: '',
                }
            }),
            onApproveData: {
                facilitatorAccessToken: '',
            },
            orderData: {
                purchase_units: [{
                    shipping: {
                        options: [{
                            id: '0',
                            selected: true,
                        }],
                    }
                }],
            },
            getCustomerResult: {platform_id: null},
            tokenizePaymentResult: {
                nonce: 'nonce',
                details: {
                    firstName: 'First',
                    lastName: 'Last',
                    email: 'email@example.com',
                    phone: 'phone',
                    billingAddress: {
                        city: 'city',
                        countryCode: 'CA',
                        line1: 'line1',
                        postalCode: 'R0A0T0',
                        state: 'MB',
                    },
                    shippingAddress: {
                        recipientName: 'Test McTesterson Person',
                        city: 'city',
                        countryCode: 'CA',
                        line1: 'line1',
                        postalCode: 'R0A0T0',
                        state: 'MB',
                    },
                },
            },
            expectedTokenizeArguments: {
                payerId: '',
                billingToken: undefined,
                paymentId: undefined,
                vault: false,
            },
        });

        return tests.map(t => [{...t, button: 'paypal'}, {...t, button: 'paylater'}]).flat();
    })())('$name: button=$button', async ({
        button,
        onApproveData,
        tokenizePaymentResult,
        getCustomerResult,
        orderData,
        expectedBatch,
        expectedTokenizeArguments,
    }) => {
        // Arranging
        const paypalMock = mocked(paypal, true);
        const actions = {
            redirect: jest.fn(),
            restart: jest.fn(),
            order: {get: () => Promise.resolve(orderData)},
        } as const;
        paypalMock.Buttons?.mockReturnValue({
            isEligible: () => true,
            render: () => Promise.resolve(),
        } as any);
        getCustomerMock.mockReturnValue(getCustomerResult);
        getTotalsMock.mockReturnValue({totalAmountDue: 1001} as any);
        getTotalsMock.mockReturnValue({totalAmountDue: 1001} as any);
        getOrderInitialDataMock.mockReturnValue({
            country_info: [{
                iso_code: 'CA',
                name: 'Canada',
                provinces: [{
                    iso_code: 'MB',
                    name: 'Manitoba',
                }]
            }]
        } as any);
        paypalCheckoutInstance.tokenizePayment = jest.fn().mockResolvedValue(tokenizePaymentResult);
        batchRequestMock.mockResolvedValue({success: true} as any);
        addPaymentMock.mockResolvedValue({success: true} as any);

        // Acting
        await initBraintreePayPalButtons({is_paylater_enabled: true, properties: {public_id: 'public_id'}} as any);
        const buttonInstance = paypalMock.Buttons!.mock.calls.find(c => c[0]!.fundingSource === button)![0]!;
        await buttonInstance.onApprove!(onApproveData, actions as any);

        // Asserting
        expect(actions.redirect).not.toBeCalled();
        expect(actions.restart).not.toBeCalled();
        expect(orderProcessingMock).toBeCalled();
        expect(paypalCheckoutInstance.tokenizePayment).toBeCalledWith(expectedTokenizeArguments);
        expect(batchRequestMock).toBeCalledWith(expectedBatch);
        expect(addPaymentMock).toBeCalledWith({
            gateway_public_id: 'public_id',
            token: 'nonce',
        });
    });
});
