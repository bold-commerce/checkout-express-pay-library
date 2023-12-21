import {
    changeStripeShippingLines,
    getPaymentRequestDisplayItems,
    API_RETRY,
    IStripeShippingOptions,
    getTotals,
    ITotals
} from 'src';
import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    changeShippingLine,
    estimateTaxes,
    getOrderInitialData,
    getShippingLines,
    IOrderInitialData,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import {orderInitialDataMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping/getShippingLines');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getOrderInitialData');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes/estimateTaxes');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes/setTaxes');
jest.mock('src/utils/getPaymentRequestDisplayItems');
jest.mock('src/utils/getTotals');
const getTotalsMock = mocked(getTotals, true);
const changeShippingLineMock = mocked(changeShippingLine, true);
const getPaymentRequestDisplayItemMock = mocked(getPaymentRequestDisplayItems, true);
const getShippingLinesMock = mocked(getShippingLines, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const estimateTaxesMock = mocked(estimateTaxes, true);
const setTaxesMock = mocked(setTaxes, true);

describe('testing change shipping lines function', () => {
    const orderTotal = 200;
    const updateWithMock = jest.fn();
    const shippingOptionMock: IStripeShippingOptions = {
        id: '2',
        amount: 1999,
        label: 'test line'
    };
    const returnObject = {...baseReturnObject};
    const displayItemMock = [{label: 'test', amount: 1200}];
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: orderTotal,
        totalAmountDue: orderTotal,
        totalPaid: 0,
        totalFees: 1200,
        totalTaxes: 0,
        totalDiscounts: 1,
        totalAdditionalFees: 0
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTotalsMock.mockReturnValue(totals);
        getPaymentRequestDisplayItemMock.mockReturnValueOnce(displayItemMock);
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
    });

    test('testing the function with success without rsa', async () => {
        returnObject.success = true;
        changeShippingLineMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve(returnObject));
        setTaxesMock.mockReturnValue(Promise.resolve(returnObject));
        await changeStripeShippingLines({shippingOption: shippingOptionMock, updateWith: updateWithMock});

        expect(getTotalsMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith(shippingOptionMock.id, API_RETRY);
        expect(setTaxesMock).toHaveBeenCalledWith(API_RETRY);
        expect(updateWithMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toBeCalledWith({
            total: {
                label: 'Total',
                amount: orderTotal,
            },
            status: 'success',
            displayItems: displayItemMock
        });
    });

    test('testing the function with success with rsa', async () => {

        const {general_settings: generalSettings} = orderInitialDataMock;
        const {checkout_process: checkoutProcess} = generalSettings;
        const newGeneralSettings = {...generalSettings, checkout_process: {...checkoutProcess, rsa_enabled: true}};
        const initialData: IOrderInitialData = {...orderInitialDataMock, general_settings: newGeneralSettings};

        getOrderInitialDataMock.mockReturnValue(initialData);
        returnObject.success = true;
        changeShippingLineMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve(returnObject));
        estimateTaxesMock.mockReturnValue(Promise.resolve(returnObject));
        await changeStripeShippingLines({shippingOption: shippingOptionMock, updateWith: updateWithMock});

        expect(getTotalsMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith(shippingOptionMock.id, API_RETRY);
        expect(estimateTaxesMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toBeCalledWith({
            total: {
                label: 'Total',
                amount: orderTotal,
            },
            status: 'success',
            displayItems: displayItemMock
        });
    });

    test('testing the function failure without rsa', async () => {
        returnObject.success = false;
        changeShippingLineMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve(returnObject));
        setTaxesMock.mockReturnValue(Promise.resolve(returnObject));
        await changeStripeShippingLines({shippingOption: shippingOptionMock, updateWith: updateWithMock});

        expect(getTotalsMock).toHaveBeenCalledTimes(0);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith(shippingOptionMock.id, API_RETRY);
        expect(setTaxesMock).toHaveBeenCalledTimes(0);
        expect(updateWithMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toBeCalledWith({
            status: 'fail'
        });
    });

    test('testing the function with failure with rsa', async () => {
        const {general_settings: generalSettings} = orderInitialDataMock;
        const {checkout_process: checkoutProcess} = generalSettings;
        const newGeneralSettings = {...generalSettings, checkout_process: {...checkoutProcess, rsa_enabled: true}};
        const initialData: IOrderInitialData = {...orderInitialDataMock, general_settings: newGeneralSettings};

        getOrderInitialDataMock.mockReturnValue(initialData);
        returnObject.success = false;
        changeShippingLineMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve(returnObject));
        estimateTaxesMock.mockReturnValue(Promise.resolve(returnObject));
        await changeStripeShippingLines({shippingOption: shippingOptionMock, updateWith: updateWithMock});

        expect(getTotalsMock).toHaveBeenCalledTimes(0);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith(shippingOptionMock.id, API_RETRY);
        expect(estimateTaxesMock).toHaveBeenCalledTimes(0);
        expect(updateWithMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toBeCalledWith({
            status: 'fail'
        });
    });

    test('testing the tax with failure with rsa', async () => {
        const {general_settings: generalSettings} = orderInitialDataMock;
        const {checkout_process: checkoutProcess} = generalSettings;
        const newGeneralSettings = {...generalSettings, checkout_process: {...checkoutProcess, rsa_enabled: true}};
        const initialData: IOrderInitialData = {...orderInitialDataMock, general_settings: newGeneralSettings};

        getOrderInitialDataMock.mockReturnValue(initialData);
        const successReturnObject = {...baseReturnObject, success: true};
        const failureReturnObject = {...baseReturnObject};
        changeShippingLineMock.mockReturnValueOnce(Promise.resolve(successReturnObject));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve(successReturnObject));
        estimateTaxesMock.mockReturnValue(Promise.resolve(failureReturnObject));
        await changeStripeShippingLines({shippingOption: shippingOptionMock, updateWith: updateWithMock});

        expect(getTotalsMock).toHaveBeenCalledTimes(0);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith(shippingOptionMock.id, API_RETRY);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(1);
        expect(estimateTaxesMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toHaveBeenCalledTimes(1);
        expect(updateWithMock).toBeCalledWith({
            status: 'fail'
        });
    });


});
