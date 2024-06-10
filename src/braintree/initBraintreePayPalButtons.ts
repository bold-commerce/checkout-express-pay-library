import { getCurrency, IShippingLine, IApplicationState, getOrderInitialData, addPayment, batchRequest, IBatchableRequest, estimateShippingLines, IAddress, IApiSuccessResponse, getLineItems, getCustomer } from '@boldcommerce/checkout-frontend-library';
import { OnApproveActions, OnApproveData, OnShippingChangeActions, OnShippingChangeData } from '@paypal/paypal-js';
import { displayError, enableDisableSection, orderProcessing } from 'src/actions';
import { getPaypalNameSpace, setPaypalNameSpace, paypalOnClick } from 'src/paypal';
import { IBraintreeClient, IBraintreePaypalCheckoutInstance } from 'src/types';
import { getTotals, getValueByCurrency, loadJS } from 'src/utils';
import { showPaymentMethodTypes } from 'src/variables';
import { braintreeOnLoadClient } from './braintreeOnLoadClient';
import { getBraintreeJsUrls } from './getBraintreeJsUrls';
import { getBraintreeClient } from './manageBraintreeState';

// TODO move this interface to frontend library
export interface IExpressPayBraintreePaypal {
    is_paylater_enabled: boolean;
    is_test: 0 | 1;
    properties: {
        public_id: string;
        commit: boolean;
    };
    tokenization_key: string;
    type: 'braintree-paypal';
    validation_schema: unknown[];
}

interface IEstimateShippingLinesResponse {
    // Yes this is the correct key
    'shipping options': IShippingLine[];
    application_state: IApplicationState;
}

const handleCreateOrder = (paypalCheckout: IBraintreePaypalCheckoutInstance) => async (): Promise<string> => {
    const totals = getTotals();
    const currencyCode = getCurrency().iso_code;

    return paypalCheckout.createPayment({
        currency: currencyCode,
        flow: 'checkout',
        amount: getValueByCurrency(totals.totalAmountDue, currencyCode),
        intent: 'authorize',
        requestBillingAgreement: true,
        enableShippingAddress: getLineItems().some(li => li.product_data.requires_shipping),
        shippingOptions: [],
    });
};

const handleApprove = (
    paypalCheckout: IBraintreePaypalCheckoutInstance,
    payment: IExpressPayBraintreePaypal,
) => async (
    data: OnApproveData,
    actions: OnApproveActions,
): Promise<void> => {
    /* istanbul ignore next */
    if (!actions.order) {
        displayError('There was an unknown error while processing your payment.', 'payment_gateway', 'unknown_error');
        return;
    }

    const [result, order] = await Promise.all([
        paypalCheckout.tokenizePayment({
            payerId: data.payerID ?? '',
            billingToken: data.billingToken ?? undefined,
            paymentId: data.paymentID ?? undefined,
            vault: false
        }),
        actions.order.get(),
    ]);

    const countries = getOrderInitialData().country_info;
    const customer = getCustomer();
    const shippingAddress = result.details.shippingAddress;
    const billingAddress = result.details.billingAddress;
    const shippingCountry = shippingAddress ? countries.find(c => c.iso_code === shippingAddress.countryCode) : null;
    const billingCountry = countries.find(c => c.iso_code === billingAddress.countryCode);
    /* istanbul ignore next */
    const shippingProvince = shippingCountry?.provinces.find(p => p.iso_code === shippingAddress?.state);
    /* istanbul ignore next */
    const billingProvince = billingCountry?.provinces.find(p => p.iso_code === billingAddress.state);
    const shippingOption = order.purchase_units[0].shipping?.options?.find(o => o.selected);
    
    /* istanbul ignore next */
    if (!billingProvince || !billingCountry) {
        displayError('There was an unknown error while processing your payment.', 'payment_gateway', 'unknown_error');
        return;
    }
    
    const [shippingFirstName, ...rest] = shippingAddress?.recipientName.split(' ') ?? [];
    const shippingLastName = rest.join(' ');
    const batchRequests: IBatchableRequest[] = [];
    !customer?.platform_id && batchRequests.push({
        apiType: 'updateCustomer',
        payload: {
            first_name: result.details.firstName,
            last_name: result.details.lastName,
            email_address: result.details.email,
            email: result.details.email,
            accepts_marketing: false,
        }
    });
    !!shippingCountry && !!shippingProvince && !!shippingAddress && batchRequests.push({
        apiType: 'setShippingAddress',
        payload: {
            first_name: shippingFirstName,
            last_name: shippingLastName,
            address_line_1: shippingAddress.line1,
            address_line_2: shippingAddress.line2 ?? '',
            business_name: '',
            city: shippingAddress.city,
            country: shippingCountry.name,
            country_code: shippingCountry.iso_code,
            province: shippingProvince.name,
            province_code: shippingProvince.iso_code,
            phone_number: result.details.phone,
            postal_code: shippingAddress.postalCode,
        },
    });
    batchRequests.push({
        apiType: 'setBillingAddress',
        payload: {
            first_name: result.details.firstName,
            last_name: result.details.lastName,
            address_line_1: billingAddress.line1,
            address_line_2: billingAddress.line2 ?? '',
            business_name: '',
            city: billingAddress.city,
            country: billingCountry.name,
            country_code: billingCountry.iso_code,
            province: billingProvince.name,
            province_code: billingProvince.iso_code,
            phone_number: result.details.phone,
            postal_code: billingAddress.postalCode,
        },
    });
    shippingOption && batchRequests.push({
        apiType: 'changeShippingLines',
        payload: {
            index: shippingOption.id,
        },
    });
    batchRequests.push({
        apiType: 'setTaxes',
        payload: {},
    });
    
    let resp = await batchRequest(batchRequests);
    /* istanbul ignore next */
    if (!resp.success) {
        displayError('There was an unknown error while processing your payment.', 'payment_gateway', 'unknown_error');
        return;
    }

    resp = await addPayment({
        gateway_public_id: payment.properties.public_id,
        token: result.nonce,
    });
    /* istanbul ignore next */
    if (!resp.success) {
        displayError('There was an unknown error while processing your payment.', 'payment_gateway', 'unknown_error');
        return;
    }

    orderProcessing();
};

const handleShippingChange = (
    paypalCheckout: IBraintreePaypalCheckoutInstance
) => async (
    data: OnShippingChangeData,
    actions: OnShippingChangeActions
): Promise<void> => {
    /* istanbul ignore next */
    if (!data.shipping_address) {
        return actions.reject();
    }
    
    const currency = getCurrency();
    const currencyCode = currency.iso_code;
    const resp = await estimateShippingLines({
        city: data.shipping_address.city,
        country_code: data.shipping_address.country_code,
        province_code: data.shipping_address.state,
        postal_code: data.shipping_address.postal_code,
    } as unknown as IAddress);
    /* istanbul ignore next */
    if (!resp.success) {
        actions.reject();
        return;
    }

    let hasSelected = false;
    const amountDue = getTotals().totalAmountDue;
    const respData = (resp.response as IApiSuccessResponse).data as IEstimateShippingLinesResponse;
    const serverSelectedShippingId = respData.application_state.shipping.selected_shipping?.id;
    const options = respData.application_state.shipping.available_shipping_lines.map(o => {
        hasSelected ||= serverSelectedShippingId === o.id;
        return {
            id: o.id, 
            label: o.description,
            selected: serverSelectedShippingId === o.id,
            amount: {
                value: getValueByCurrency(o.amount, currencyCode),
                currency: currencyCode,
            },
            type: 'SHIPPING' as const,
        };
    });

    if (!hasSelected && options && options.length) {
        options[0].selected = true;
    }

    await paypalCheckout.updatePayment({
        paymentId: data.paymentID as string,
        currency: currencyCode,
        amount: getValueByCurrency(amountDue, currencyCode),
        shippingOptions: options,
    });

    actions.resolve();
};

async function makeButtons(payment: IExpressPayBraintreePaypal, paypalCheckout: IBraintreePaypalCheckoutInstance): Promise<void> {
    const paypal = getPaypalNameSpace();
    let enableSection = false;

    const paypalButtonDiv = document.createElement('div');
    const paypalButtonDivId = 'ppcp-paypal-express-payment-button';
    paypalButtonDiv.id = paypalButtonDivId;
    paypalButtonDiv.classList.add('express-payment');
    paypalButtonDiv.dataset.testid = paypalButtonDivId;

    const payLaterButtonDiv = document.createElement('div');
    const payLaterButtonDivId = 'ppcp-paylater-express-payment-button';
    payLaterButtonDiv.id = payLaterButtonDivId;
    payLaterButtonDiv.classList.add('express-payment');
    payLaterButtonDiv.dataset.testid = payLaterButtonDivId;

    // creating a paypal payment div inside express payment container
    const paypalDiv = document.createElement('div');
    const paypalDivId = 'ppcp-express-payment';
    paypalDiv.id = paypalDivId;
    paypalDiv.className = `${paypalDivId}`;
    paypalDiv.appendChild(paypalButtonDiv);
    paypalDiv.appendChild(payLaterButtonDiv);
    const container = document.getElementById('express-payment-container');
    if (container) {
        container.appendChild(paypalDiv);
    }

    if (paypal && paypal.Buttons) {
        const paypalButton = paypal.Buttons({
            fundingSource: 'paypal',
            createOrder: handleCreateOrder(paypalCheckout),
            onClick: paypalOnClick,
            onShippingChange: handleShippingChange(paypalCheckout),
            onApprove: handleApprove(paypalCheckout, payment),
        });

        const payLaterButton = paypal.Buttons({
            fundingSource: 'paylater',
            createOrder: handleCreateOrder(paypalCheckout),
            onClick: paypalOnClick,
            onShippingChange: handleShippingChange(paypalCheckout),
            onApprove: handleApprove(paypalCheckout, payment),
        });

        if(container) {
            if (paypalButton.isEligible()) {
                await paypalButton.render(`#${paypalButtonDivId}`);
                enableSection = true;
            }

            if (payLaterButton.isEligible() && payment.is_paylater_enabled) {
                await payLaterButton.render(`#${payLaterButtonDivId}`);
                enableSection = true;
            }

        }

        /* istanbul ignore else */
        if(enableSection) {
            enableDisableSection(showPaymentMethodTypes.PPCP, true);
        } else {
            paypalDiv.style.display = 'none';
        }
    }
}

export const initBraintreePayPalButtons = async (payment: IExpressPayBraintreePaypal): Promise<void> => {
    const {clientJsURL, dataCollectorJsURL, paypalCheckoutURL} = getBraintreeJsUrls();

    await Promise.all([
        loadJS(clientJsURL),
        loadJS(dataCollectorJsURL),
        loadJS(paypalCheckoutURL),
    ]).then(braintreeOnLoadClient);

    const braintree = getBraintreeClient() as IBraintreeClient;
    const client = await braintree.client.create({authorization: payment.tokenization_key});

    const paypalCheckout = await braintree.paypalCheckout.create({client: client});
    await paypalCheckout.loadPayPalSDK({
        intent: 'authorize',
        currency: getCurrency().iso_code,
    });

    /* istanbul ignore next */
    if (!window.paypal) {
        throw new Error('Unreconcilable: PayPal not found on window');
    }

    setPaypalNameSpace(window.paypal);
    await makeButtons(payment, paypalCheckout);
};