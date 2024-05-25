/* eslint-disable @typescript-eslint/no-explicit-any */
import {alternatePaymentMethodType, getEnvironment, getJwtToken, getOrderInitialData, getPublicOrderId, getShopIdentifier, IOrderInitialData} from '@boldcommerce/checkout-frontend-library';
import {loadScript} from '@paypal/paypal-js';
import {mocked} from 'jest-mock';
import {IBraintreeUrls, IFastlaneOptions, braintreeOnLoadClient, getBraintreeClient, getBraintreeJsUrls, initFastlane, loadJS, getPaypalNameSpacePromise, getPaypalNameSpace, initPpcpSdk} from 'src';

jest.mock('src/braintree/getBraintreeJsUrls.ts');
jest.mock('src/utils/loadJS.ts');
jest.mock('src/braintree/manageBraintreeState.ts');
jest.mock('src/paypal/managePaypalState.ts');
jest.mock('src/braintree/braintreeOnLoadClient.ts');
jest.mock('src/paypal/ppcp_buttons/initPpcpButtons.ts');
jest.mock('src/fastlane/manageFastlaneState.ts');
jest.mock('@boldcommerce/checkout-frontend-library', () => ({
    ...jest.requireActual('@boldcommerce/checkout-frontend-library'),
    getEnvironment: jest.fn(),
    getJwtToken: jest.fn(),
    getPublicOrderId: jest.fn(),
    getShopIdentifier: jest.fn(),
    getOrderInitialData: jest.fn(),
}));
jest.mock('@paypal/paypal-js', () => ({
    ...jest.requireActual('@paypal/paypal-js'),
    loadScript: jest.fn(),
}));

const getBraintreeJsUrlsMock = mocked(getBraintreeJsUrls);
const getPublicOrderIdMock = mocked(getPublicOrderId);
const getEnvironmentMock = mocked(getEnvironment);
const getShopIdentifierMock = mocked(getShopIdentifier);
const getJwtTokenMock = mocked(getJwtToken);
const loadJSMock = mocked(loadJS);
const braintreeOnLoadClientMock = mocked(braintreeOnLoadClient);
const getBraintreeClientMock = mocked(getBraintreeClient);
const loadScriptMock = mocked(loadScript) as jest.Mock;
const getOrderInitialDataMock = mocked(getOrderInitialData);
const getPaypalNameSpaceMock = mocked(getPaypalNameSpace);
const getPaypalNameSpacePromiseMock = mocked(getPaypalNameSpacePromise);
const initPpcpSdkMock = mocked(initPpcpSdk);

describe('testing initFastlane function', () => {
    let fetchMock: jest.Mock;
    let actualFetch: typeof fetch;

    beforeEach(() => {
        actualFetch = global.fetch;
        fetchMock = global.fetch = jest.fn();
        getOrderInitialDataMock.mockReturnValue({
            alternative_payment_methods: [],
        } as any);
    });

    afterEach(() => {
        global.fetch = actualFetch;
        jest.resetAllMocks();
    });

    test('init braintree correctly', async () => {
        // Arranging
        getBraintreeJsUrlsMock.mockReturnValue({
            clientJsURL: 'client', dataCollectorJsURL: 'data', fastlaneJsURL: 'fastlane',
        } as IBraintreeUrls);
        getEnvironmentMock.mockReturnValue({
            path: 'path',
            type: 'testing',
            url: 'https://staging.com',
        });
        getPublicOrderIdMock.mockReturnValue('testOrderId');
        getShopIdentifierMock.mockReturnValue('testShopId');
        getJwtTokenMock.mockReturnValue('jwt');
        fetchMock.mockResolvedValue({
            json: () => Promise.resolve({
                data: {
                    client_token: 'client_token',
                    client_id: null,
                    type: 'braintree',
                    is_test_mode: false,
                    gateway_public_id: 'gatewayPublicId',
                },
            }),
        });
        const client = {create: jest.fn()};
        const fastlane = {create: jest.fn()};
        fastlane.create.mockReturnValue({
            setLocale: jest.fn(),
            FastlaneCardComponent: jest.fn(),
            FastlanePaymentComponent: jest.fn(),
            FastlaneWatermarkComponent: jest.fn(),
            identity: {
                lookupCustomerByEmail: jest.fn(),
            },
            profile: {
                showCardSelector: jest.fn(),
            },
        });

        const dataCollector = {create: jest.fn()};
        dataCollector.create.mockReturnValue({deviceData: null});

        getBraintreeClientMock.mockReturnValue({
            client,
            fastlane,
            dataCollector,
            applePay: {create: jest.fn()},
            googlePayment: {create: jest.fn()},
        });

        // Assigning
        const actualFastlane = await initFastlane();

        // Asserting
        expect(actualFastlane.gatewayPublicId).toBe('gatewayPublicId');
        expect(actualFastlane.type).toBe('braintree');

        expect(loadJSMock).toBeCalledTimes(3);
        expect(loadJSMock).toBeCalledWith('client');
        expect(loadJSMock).toBeCalledWith('fastlane');
        expect(loadJSMock).toBeCalledWith('data');

        expect(braintreeOnLoadClientMock).toBeCalled();

        expect(client.create).toBeCalled();
        expect(dataCollector.create).toBeCalled();
        expect(fastlane.create).toBeCalled();

    });

    test('init braintree correctly with options', async () => {
        // Arranging
        getBraintreeJsUrlsMock.mockReturnValue({
            clientJsURL: 'client', dataCollectorJsURL: 'data', fastlaneJsURL: 'fastlane',
        } as IBraintreeUrls);
        getEnvironmentMock.mockReturnValue({
            path: 'path',
            type: 'testing',
            url: 'https://staging.com',
        });
        getPublicOrderIdMock.mockReturnValue('testOrderId');
        getShopIdentifierMock.mockReturnValue('testShopId');
        getJwtTokenMock.mockReturnValue('jwt');
        fetchMock.mockResolvedValue({
            json: () => Promise.resolve({
                data: {
                    client_token: 'client_token',
                    client_id: null,
                    type: 'braintree',
                    is_test_mode: false,
                    gateway_public_id: 'gatewayPublicId',
                },
            }),
        });
        const client = {create: jest.fn()};
        const fastlane = {create: jest.fn()};
        fastlane.create.mockReturnValue({
            setLocale: jest.fn(),
            FastlaneCardComponent: jest.fn(),
            FastlanePaymentComponent: jest.fn(),
            FastlaneWatermarkComponent: jest.fn(),
            identity: {
                lookupCustomerByEmail: jest.fn(),
            },
            profile: {
                showCardSelector: jest.fn(),
            },
        });

        const dataCollector = {create: jest.fn()};
        dataCollector.create.mockReturnValue({deviceData: null});

        getBraintreeClientMock.mockReturnValue({
            client,
            fastlane,
            dataCollector,
            applePay: {create: jest.fn()},
            googlePayment: {create: jest.fn()},
        });

        const options = {
            styles: {}
        } as IFastlaneOptions;

        // Assigning
        const actualFastlane = await initFastlane(options);

        // Asserting
        expect(actualFastlane.gatewayPublicId).toBe('gatewayPublicId');
        expect(actualFastlane.type).toBe('braintree');

        expect(loadJSMock).toBeCalledTimes(3);
        expect(loadJSMock).toBeCalledWith('client');
        expect(loadJSMock).toBeCalledWith('fastlane');
        expect(loadJSMock).toBeCalledWith('data');

        expect(braintreeOnLoadClientMock).toBeCalled();

        expect(client.create).toBeCalled();
        expect(dataCollector.create).toBeCalled();
        expect(fastlane.create).toBeCalled();

    });

    test('init ppcp correctly from nothing', async () => {
        // Arranging
        const payment = {
            alternative_payment_methods: [{
                type: alternatePaymentMethodType.PPCP,
                public_id: 'gatewayPublicId',
            }]
        } as IOrderInitialData;
        getBraintreeJsUrlsMock.mockReturnValue({
            clientJsURL: 'client', dataCollectorJsURL: 'data', fastlaneJsURL: 'fastlane',
        } as IBraintreeUrls);
        getOrderInitialDataMock.mockReturnValue(payment);
        getPaypalNameSpacePromiseMock.mockReturnValue(null);
        getPaypalNameSpaceMock.mockReturnValue(null);
        initPpcpSdkMock.mockImplementation(async () => {
            getPaypalNameSpaceMock.mockReturnValue({
                Fastlane: () => Promise.resolve({
                    setLocale: jest.fn(),
                    FastlaneCardComponent: jest.fn(),
                    FastlanePaymentComponent: jest.fn(),
                    FastlaneWatermarkComponent: jest.fn(),
                    identity: {
                        lookupCustomerByEmail: jest.fn(),
                    },
                    profile: {
                        showCardSelector: jest.fn(),
                    },
                }),
            } as any);
        });

        // Assigning
        const actualFastlane = await initFastlane();

        // Asserting
        expect(actualFastlane.gatewayPublicId).toBe('gatewayPublicId');
        expect(actualFastlane.type).toBe('ppcp');
    });

    test('init ppcp correctly from in-flight', async () => {
        // Arranging
        let resolve: any;
        const promise = new Promise(r => resolve = r);
        const payment = {
            alternative_payment_methods: [{
                type: alternatePaymentMethodType.PPCP,
                public_id: 'gatewayPublicId',
            }]
        } as IOrderInitialData;
        getBraintreeJsUrlsMock.mockReturnValue({
            clientJsURL: 'client', dataCollectorJsURL: 'data', fastlaneJsURL: 'fastlane',
        } as IBraintreeUrls);
        getOrderInitialDataMock.mockReturnValue(payment);
        getPaypalNameSpacePromiseMock.mockReturnValue(Promise.resolve() as any);
        getPaypalNameSpaceMock.mockReturnValueOnce(null);
        getPaypalNameSpaceMock.mockReturnValueOnce({
            Fastlane: () => Promise.resolve({
                setLocale: jest.fn(),
                FastlaneCardComponent: jest.fn(),
                FastlanePaymentComponent: jest.fn(),
                FastlaneWatermarkComponent: jest.fn(),
                identity: {
                    lookupCustomerByEmail: jest.fn(),
                },
                profile: {
                    showCardSelector: jest.fn(),
                },
            }),
        } as any);

        // Assigning
        const actualFastlane = await initFastlane();
        

        // Asserting
        expect(actualFastlane.gatewayPublicId).toBe('gatewayPublicId');
        expect(actualFastlane.type).toBe('ppcp');
    });

    test('init ppcp correctly with options', async () => {
        // Arranging
        getBraintreeJsUrlsMock.mockReturnValue({
            clientJsURL: 'client', dataCollectorJsURL: 'data', fastlaneJsURL: 'fastlane',
        } as IBraintreeUrls);
        getOrderInitialDataMock.mockReturnValue({
            alternative_payment_methods: [{
                type: alternatePaymentMethodType.PPCP,
                public_id: 'gatewayPublicId',
            }]
        } as IOrderInitialData);
        getPaypalNameSpacePromiseMock.mockReturnValue(null);
        getPaypalNameSpaceMock.mockReturnValue(null);
        initPpcpSdkMock.mockImplementation(async () => {
            getPaypalNameSpaceMock.mockReturnValue({
                Fastlane: () => Promise.resolve({
                    setLocale: jest.fn(),
                    FastlaneCardComponent: jest.fn(),
                    FastlanePaymentComponent: jest.fn(),
                    FastlaneWatermarkComponent: jest.fn(),
                    identity: {
                        lookupCustomerByEmail: jest.fn(),
                    },
                    profile: {
                        showCardSelector: jest.fn(),
                    },
                }),
            } as any);
        }); 

        const options = {
            styles: {}
        } as IFastlaneOptions;

        // Assigning
        const actualFastlane = await initFastlane(options);

        // Asserting
        expect(actualFastlane.gatewayPublicId).toBe('gatewayPublicId');
        expect(actualFastlane.type).toBe('ppcp');
    });

    test('init error', async () => {
        // Arranging
        getBraintreeJsUrlsMock.mockReturnValue({
            clientJsURL: 'client', dataCollectorJsURL: 'data', fastlaneJsURL: 'fastlane',
        } as IBraintreeUrls);
        getOrderInitialDataMock.mockReturnValue({
            alternative_payment_methods: [{
                type: alternatePaymentMethodType.PPCP,
                public_id: 'gatewayPublicId',
            }]
        } as IOrderInitialData);
        getPaypalNameSpacePromiseMock.mockReturnValue(null);
        getPaypalNameSpaceMock.mockReturnValue(null);
        initPpcpSdkMock.mockRejectedValue(new Error('Oh no!'));

        // Assigning
        try {
            await initFastlane();
        } catch (e: unknown) {
            // Asserting
            expect((e as Error).message).toBe('Oh no!');
        }
    });

    test.each([
        [new Error('test'), 'test'],
        ['test', 'Error loading Fastlane: test'],
    ])('init exception', async (error, expectedMsg) => {
        // Arranging
        getOrderInitialDataMock.mockReturnValue({
            alternative_payment_methods: [{
                type: alternatePaymentMethodType.PPCP,
                public_id: 'gatewayPublicId',
            }]
        } as IOrderInitialData);
        getBraintreeJsUrlsMock.mockReturnValue({
            clientJsURL: 'client', dataCollectorJsURL: 'data', fastlaneJsURL: 'fastlane',
        } as IBraintreeUrls);
        initPpcpSdkMock.mockRejectedValue(error);

        // Assigning
        try {
            await initFastlane();
        } catch (e: unknown) {
            // Asserting
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toBe(expectedMsg);
        }
    });
});