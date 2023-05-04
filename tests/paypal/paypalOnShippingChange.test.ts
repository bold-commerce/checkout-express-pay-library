import {OnShippingChangeActions, OnShippingChangeData} from '@paypal/paypal-js/types/components/buttons';
import {
    API_RETRY,
    callShippingAddressEndpoint,
    formatPaypalToApiAddress,
    getPaypalPatchOperations,
    IPaypalPatchOperation,
    paypalOnShippingChange
} from 'src';
import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    changeShippingLine,
    getShipping,
    getShippingLines,
    ISetShippingAddressRequest,
    IShipping
} from '@boldcommerce/checkout-frontend-library';
import {setTaxes} from '@boldcommerce/checkout-frontend-library/lib/taxes/setTaxes';
import {shippingMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {AmountWithBreakdown, ShippingInfoOption} from '@paypal/paypal-js/types/apis/orders';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping/getShippingLines');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping/changeShippingLine');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes/setTaxes');
jest.mock('@boldcommerce/checkout-frontend-library/lib/address/setShippingAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/address/updateShippingAddress');
jest.mock('src/paypal/formatPaypalToApiAddress');
jest.mock('src/paypal/getPaypalPatchOperations');
jest.mock('src/utils/callShippingAddressEndpoint');
const formatPaypalToApiAddressMock = mocked(formatPaypalToApiAddress, true);
const getPaypalPatchOperationsMock = mocked(getPaypalPatchOperations, true);
const getShippingMock = mocked(getShipping, true);
const getShippingLinesMock = mocked(getShippingLines, true);
const changeShippingLineMock = mocked(changeShippingLine, true);
const setTaxesMock = mocked(setTaxes, true);
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);

describe('testing  paypalOnShippingChange function', () => {
    const onShippingChangeActionsMock: OnShippingChangeActions = {
        resolve: jest.fn().mockReturnValue(Promise.resolve()),
        reject: jest.fn().mockReturnValue(Promise.resolve()),
        order: {
            patch: jest.fn().mockReturnValue(Promise.resolve({id: '123'}))
        },
    };
    const formattedAddress: ISetShippingAddressRequest = {
        address_line_1: '',
        address_line_2: '',
        business_name: '',
        city: 'Winnipeg',
        country: 'CA',
        country_code: 'CA',
        first_name: '',
        last_name: '',
        phone_number: '',
        postal_code: 'R3Y0L6',
        province: 'MB',
        province_code: 'MB',
    };
    const paypalShippingOptions: Array<ShippingInfoOption> = [{
        amount: {currency_code: 'CAD', value: '1.00'},
        id: 'test_select_shipping_line_id',
        label: 'Test Description',
        selected: true,
        type: 'SHIPPING'}];
    const paypalAmountWithBreakdown: AmountWithBreakdown = {
        breakdown: {
            discount: {currency_code: 'CAD', value: '0.00'},
            item_total: {currency_code: 'CAD', value: '0.00'},
            shipping: {currency_code: 'CAD', value: '1.00'},
            shipping_discount: {currency_code: 'CAD', value: '0.01'},
            tax_total: {currency_code: 'CAD', value: '0.00'}
        },
        currency_code: 'CAD',
        value: '0.00'
    };
    const paypalPatchOperations: Array<IPaypalPatchOperation> = [
        {
            op: 'replace',
            path: '/purchase_units/@reference_id==\'default\'/amount',
            value: paypalAmountWithBreakdown
        },
        {
            op: 'replace',
            path: '/purchase_units/@reference_id==\'default\'/shipping/options',
            value: paypalShippingOptions
        }
    ];
    const dataMock: OnShippingChangeData = {
        forceRestAPI: true,
        shipping_address : {city: 'Winnipeg', state: 'MB', country_code: 'CA', postal_code: 'R3Y0L6'},
        selected_shipping_option : {
            label: 'test shipping',
            type: 'SHIPPING',
            amount: {currency_code: 'CAD', value: '1.00'}
        },
    };
    const successfulReturnObject = {...baseReturnObject, success: true};

    beforeEach(() => {
        jest.clearAllMocks();
        formatPaypalToApiAddressMock.mockReturnValue(formattedAddress);
        getPaypalPatchOperationsMock.mockReturnValue(paypalPatchOperations);
        getShippingMock.mockReturnValue(shippingMock);
        getShippingLinesMock.mockReturnValue(Promise.resolve(successfulReturnObject));
        changeShippingLineMock.mockReturnValue(Promise.resolve(successfulReturnObject));
        setTaxesMock.mockReturnValue(Promise.resolve(successfulReturnObject));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve(successfulReturnObject));
    });

    test('new addr, old addr empty, all data in and success API calls', async () => {
        const result = await paypalOnShippingChange(dataMock, onShippingChangeActionsMock);

        expect(result).toStrictEqual({id: '123'});
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(1);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(dataMock.shipping_address, undefined, undefined , '');
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(formattedAddress, true);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(2);
        expect(getShippingLinesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(0);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledWith(true);
        expect(onShippingChangeActionsMock.reject).toHaveBeenCalledTimes(0);
        expect(onShippingChangeActionsMock.order.patch).toHaveBeenCalledTimes(1);
    });

    test('no addr, no selected option and success API calls', async () => {
        const data = {...dataMock, shipping_address: undefined, selected_shipping_option: undefined};

        const result = await paypalOnShippingChange(data, onShippingChangeActionsMock);

        expect(result).toStrictEqual({id: '123'});
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(0);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(0);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(0);
        expect(getShippingMock).toHaveBeenCalledTimes(0);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(0);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledWith(false);
        expect(onShippingChangeActionsMock.reject).toHaveBeenCalledTimes(0);
        expect(onShippingChangeActionsMock.order.patch).toHaveBeenCalledTimes(1);
    });

    test('addr null values, no selected option and address invalid', async () => {
        const data = {...dataMock, shipping_address: {
            city: null, state: null, country_code: null, postal_code: null
        }, selected_shipping_option: undefined};
        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve(baseReturnObject));

        const result = await paypalOnShippingChange(data as unknown as OnShippingChangeData, onShippingChangeActionsMock);

        expect(result).toBe(undefined);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(formattedAddress, true);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(0);
        expect(getShippingMock).toHaveBeenCalledTimes(0);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(0);
        expect(setTaxesMock).toHaveBeenCalledTimes(0);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledTimes(0);
        expect(onShippingChangeActionsMock.reject).toHaveBeenCalledTimes(1);
        expect(onShippingChangeActionsMock.order.patch).toHaveBeenCalledTimes(0);
    });

    test('same addr, old addr not empty, all data in and success API calls', async () => {
        const result = await paypalOnShippingChange(dataMock, onShippingChangeActionsMock);

        expect(result).toStrictEqual({id: '123'});
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(1);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(dataMock.shipping_address, undefined, undefined , '');
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(formattedAddress, true);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(2);
        expect(getShippingLinesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(0);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledWith(true);
        expect(onShippingChangeActionsMock.reject).toHaveBeenCalledTimes(0);
        expect(onShippingChangeActionsMock.order.patch).toHaveBeenCalledTimes(1);
    });

    test('new addr, old addr not empty, all data in and success API calls', async () => {
        const result = await paypalOnShippingChange(dataMock, onShippingChangeActionsMock);

        expect(result).toStrictEqual({id: '123'});
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(1);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(dataMock.shipping_address, undefined, undefined , '');
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(formattedAddress, true);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(2);
        expect(getShippingLinesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(0);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledWith(true);
        expect(onShippingChangeActionsMock.reject).toHaveBeenCalledTimes(0);
        expect(onShippingChangeActionsMock.order.patch).toHaveBeenCalledTimes(1);
    });

    test('same addr, old addr not empty, no selected line, no lines, and success API calls', async () => {
        getShippingMock.mockReturnValueOnce(
            {...shippingMock, selected_shipping: null, available_shipping_lines: []} as unknown as IShipping
        );

        const result = await paypalOnShippingChange(dataMock, onShippingChangeActionsMock);

        expect(result).toStrictEqual({id: '123'});
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(1);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(dataMock.shipping_address, undefined, undefined , '');
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(formattedAddress, true);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(2);
        expect(getShippingLinesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(0);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledWith(true);
        expect(onShippingChangeActionsMock.reject).toHaveBeenCalledTimes(0);
        expect(onShippingChangeActionsMock.order.patch).toHaveBeenCalledTimes(1);
    });

    test('same addr, old addr not empty, no selected line, with line matching selected option, and success API calls', async () => {
        getShippingMock.mockReturnValueOnce(
            {...shippingMock,
                selected_shipping: null,
                available_shipping_lines: [
                    {id: '1', description: dataMock.selected_shipping_option?.label}
                ]} as unknown as IShipping
        );

        const result = await paypalOnShippingChange(dataMock, onShippingChangeActionsMock);

        expect(result).toStrictEqual({id: '123'});
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(1);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(dataMock.shipping_address, undefined, undefined , '');
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(formattedAddress, true);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(2);
        expect(getShippingLinesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith('1', API_RETRY);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledWith(true);
        expect(onShippingChangeActionsMock.reject).toHaveBeenCalledTimes(0);
        expect(onShippingChangeActionsMock.order.patch).toHaveBeenCalledTimes(1);
    });

    test('same addr, old addr not empty, no selected option and line, and success API calls', async () => {
        const data = {...dataMock, selected_shipping_option: undefined};
        getShippingMock.mockReturnValueOnce(
            {...shippingMock, selected_shipping: null} as unknown as IShipping
        );

        const result = await paypalOnShippingChange(data, onShippingChangeActionsMock);

        expect(result).toStrictEqual({id: '123'});
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(1);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(dataMock.shipping_address, undefined, undefined , '');
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(formattedAddress, true);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(2);
        expect(getShippingLinesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith('test_select_shipping_line_id', API_RETRY);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledWith(false);
        expect(onShippingChangeActionsMock.reject).toHaveBeenCalledTimes(0);
        expect(onShippingChangeActionsMock.order.patch).toHaveBeenCalledTimes(1);
    });

    test('same addr, old addr not empty, no selected option and line, and fail taxes API call', async () => {
        const data = {...dataMock, selected_shipping_option: undefined};
        getShippingMock.mockReturnValueOnce(
            {...shippingMock, selected_shipping: null} as unknown as IShipping
        );
        setTaxesMock.mockReturnValueOnce(Promise.resolve(baseReturnObject));

        const result = await paypalOnShippingChange(data, onShippingChangeActionsMock);

        expect(result).toBe(undefined);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledTimes(1);
        expect(formatPaypalToApiAddressMock).toHaveBeenCalledWith(dataMock.shipping_address, undefined, undefined , '');
        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(callShippingAddressEndpointMock).toHaveBeenCalledWith(formattedAddress, true);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(2);
        expect(getShippingLinesMock).toHaveBeenCalledWith(API_RETRY);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledWith('test_select_shipping_line_id', API_RETRY);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
        expect(getPaypalPatchOperationsMock).toHaveBeenCalledTimes(0);
        expect(onShippingChangeActionsMock.reject).toHaveBeenCalledTimes(1);
        expect(onShippingChangeActionsMock.order.patch).toHaveBeenCalledTimes(0);
    });

});
