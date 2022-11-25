import {getPaymentRequestDisplayItems, getValueByCurrency} from 'src/utils';
import {
    getApplicationState,
    getCurrency,
    getOrderInitialData
} from '@bold-commerce/checkout-frontend-library';
import {IBraintreeRequiredContactField} from 'src/types';
import {
    setBraintreeApplePaySession,
    braintreeOnValidateMerchantApple,
    braintreeOnPaymentAuthorizedApple,
    braintreeOnShippingContactSelectedApple,
    braintreeOnShippingMethodSelectedApple,
    braintreeConstants,
    getBraintreeApplePayInstanceChecked
} from 'src';

export function braintreeOnClickApple(): void {
    const appleInstance = getBraintreeApplePayInstanceChecked();
    const {iso_code: currencyCode} = getCurrency();
    const {order_total} = getApplicationState();
    const {general_settings: {checkout_process: {phone_number_required: isPhoneRequired}}} = getOrderInitialData();
    const displayItems = getPaymentRequestDisplayItems().map(
        ({label, amount}) => ({
            label,
            amount: getValueByCurrency(amount, currencyCode),
        }));
    const fields: IBraintreeRequiredContactField = ['postalAddress', 'email'];
    const fieldsWithPhone: IBraintreeRequiredContactField = [...fields, 'phone'];

    const paymentRequest = appleInstance.createPaymentRequest({
        currencyCode: currencyCode,
        total: {label: 'Total', amount: getValueByCurrency(order_total, currencyCode)},
        lineItems: displayItems,
        requiredBillingContactFields: isPhoneRequired ? fieldsWithPhone : fields,
        requiredShippingContactFields: isPhoneRequired ? fieldsWithPhone : fields,
    });

    const applePaySession = new ApplePaySession(braintreeConstants.APPLEPAY_VERSION_NUMBER, paymentRequest);
    applePaySession.onvalidatemerchant = braintreeOnValidateMerchantApple;
    applePaySession.onshippingcontactselected = braintreeOnShippingContactSelectedApple;
    applePaySession.onshippingmethodselected = braintreeOnShippingMethodSelectedApple;
    applePaySession.onpaymentauthorized = braintreeOnPaymentAuthorizedApple;
    applePaySession.begin();

    setBraintreeApplePaySession(applePaySession);
}
