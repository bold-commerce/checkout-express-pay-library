import {getCurrency, getOrderInitialData} from '@boldcommerce/checkout-frontend-library';
import {
    paypalConstants,
    setPPCPApplePaySession,
    ppcpOnValidateMerchantApple,
    getPPCPApplePayConfigChecked,
    ppcpOnShippingContactSelectedApple,
    ppcpOnShippingMethodSelectedApple,
} from 'src';
import {getPaymentRequestDisplayItems, getTotals, getValueByCurrency} from 'src/utils';
import ApplePayContactField = ApplePayJS.ApplePayContactField;
import ApplePayPaymentRequest = ApplePayJS.ApplePayPaymentRequest;

export function ppcpOnClickApple(ev: MouseEvent): void {
    ev.preventDefault();
    const applepayConfig = getPPCPApplePayConfigChecked();
    const {iso_code: currencyCode} = getCurrency();
    const {totalAmountDue} = getTotals();
    const {general_settings: {checkout_process: {phone_number_required: isPhoneRequired}}} = getOrderInitialData();
    const displayItems = getPaymentRequestDisplayItems().map(
        ({label, amount}) => ({
            label,
            amount: getValueByCurrency(amount, currencyCode),
        }));
    const fields: Array<ApplePayContactField> = ['name', 'postalAddress', 'email'];
    const fieldsWithPhone: Array<ApplePayContactField> = [...fields, 'phone'];

    const paymentRequest: ApplePayPaymentRequest = {
        currencyCode: currencyCode,
        total: {label: 'Total', amount: getValueByCurrency(totalAmountDue, currencyCode)},
        lineItems: displayItems,
        requiredShippingContactFields: isPhoneRequired ? fieldsWithPhone : fields,
        requiredBillingContactFields: isPhoneRequired ? fieldsWithPhone : fields,
        countryCode: applepayConfig.countryCode,
        merchantCapabilities: applepayConfig.merchantCapabilities,
        supportedNetworks: applepayConfig.supportedNetworks,
    };

    const applePaySession: ApplePaySession = new ApplePaySession(paypalConstants.APPLEPAY_VERSION_NUMBER, paymentRequest);
    applePaySession.oncancel = () => applePaySession.abort();
    applePaySession.onvalidatemerchant = ppcpOnValidateMerchantApple;
    applePaySession.onshippingcontactselected = ppcpOnShippingContactSelectedApple;
    applePaySession.onshippingmethodselected = ppcpOnShippingMethodSelectedApple;
    // applePaySession.onpaymentauthorized = () => {/*TODO implement ppcpOnPaymentAuthorized*/};
    applePaySession.begin();

    setPPCPApplePaySession(applePaySession);
}
