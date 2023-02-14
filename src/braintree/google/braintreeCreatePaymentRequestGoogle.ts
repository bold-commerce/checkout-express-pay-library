import {getTotals, getValueByCurrency} from 'src/utils';
import {
    getCurrency,
    getOrderInitialData
} from '@bold-commerce/checkout-frontend-library';
import {
    getBraintreeGoogleCredentialsChecked,
    getBraintreeGooglePayInstanceChecked,
    getBraintreeShippingOptionsGoogle
} from 'src';
import PaymentGatewayTokenizationParameters = google.payments.api.PaymentGatewayTokenizationParameters;
import PaymentDataRequest = google.payments.api.PaymentDataRequest;

export function braintreeCreatePaymentRequestGoogle(): PaymentDataRequest {
    const googlePayInstance = getBraintreeGooglePayInstanceChecked();
    const {merchant_account: merchantAccount, tokenization_key: authorization} = getBraintreeGoogleCredentialsChecked();
    const {country_info: countryInfo} = getOrderInitialData();
    const {iso_code: currencyCode} = getCurrency();
    const {totalAmountDue} = getTotals();
    const {general_settings: {checkout_process: {phone_number_required: phoneNumberRequired}}} = getOrderInitialData();
    const allowedShippingCountries = countryInfo.filter(c => c.valid_for_shipping);
    const allowedCountryCodes = allowedShippingCountries.map(c => c.iso_code.toUpperCase());

    const paymentDataRequest = googlePayInstance.createPaymentDataRequest({
        transactionInfo: {
            currencyCode: currencyCode,
            totalPrice: getValueByCurrency(totalAmountDue, currencyCode),
            totalPriceStatus: 'ESTIMATED'
        }
    });
    paymentDataRequest.callbackIntents = ['SHIPPING_ADDRESS', 'SHIPPING_OPTION', 'PAYMENT_AUTHORIZATION'];
    paymentDataRequest.emailRequired = true;
    paymentDataRequest.shippingAddressRequired = true;
    paymentDataRequest.shippingAddressParameters = {allowedCountryCodes, phoneNumberRequired};
    paymentDataRequest.shippingOptionRequired = true;
    paymentDataRequest.shippingOptionParameters = getBraintreeShippingOptionsGoogle();

    const cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
    cardPaymentMethod.parameters.billingAddressRequired = true;
    cardPaymentMethod.parameters.billingAddressParameters = {format: 'FULL', phoneNumberRequired};
    cardPaymentMethod.parameters.allowedCardNetworks = ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'];

    const tokenizationSpecificParameter = cardPaymentMethod.tokenizationSpecification.parameters as PaymentGatewayTokenizationParameters;
    tokenizationSpecificParameter['gatewayMerchantId'] = merchantAccount;
    tokenizationSpecificParameter['braintree:clientKey'] = authorization;

    return paymentDataRequest;
}
