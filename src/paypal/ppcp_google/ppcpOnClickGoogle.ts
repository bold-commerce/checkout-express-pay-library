import {getCurrency, getOrderInitialData} from '@boldcommerce/checkout-frontend-library';
import {
    getPPCPGooglePayConfigChecked, getPPCPGooglePaySession,
} from 'src';
import {getTotals, getValueByCurrency} from 'src/utils';
import PaymentDataRequest = google.payments.api.PaymentDataRequest;

export function ppcpOnClickGoogle(): void {
    const googlePayConfig = getPPCPGooglePayConfigChecked();
    const {allowedPaymentMethods,merchantInfo, apiVersion, apiVersionMinor , countryCode} = googlePayConfig;

    const {iso_code: currencyCode} = getCurrency();
    const {totalAmountDue} = getTotals();
    const {general_settings: {checkout_process: {phone_number_required: isPhoneRequired}}} = getOrderInitialData();
    const {country_info: countryInfo} = getOrderInitialData();
    const allowedShippingCountries = countryInfo.filter(c => c.valid_for_shipping);
    const allowedCountryCodes = allowedShippingCountries.map(c => c.iso_code.toUpperCase());
    const paymentMethod = allowedPaymentMethods[0];
    paymentMethod.parameters.billingAddressRequired = true;
    paymentMethod.parameters.billingAddressParameters = {format: 'FULL', phoneNumberRequired: isPhoneRequired};

    const paymentRequest: PaymentDataRequest = {
        transactionInfo: {
            currencyCode: currencyCode,
            countryCode: countryCode,
            totalPrice: getValueByCurrency(totalAmountDue, currencyCode),
            totalPriceStatus: 'ESTIMATED',
        },
        shippingAddressRequired: true,
        emailRequired: true,
        shippingAddressParameters: {
            allowedCountryCodes: allowedCountryCodes,
            phoneNumberRequired: isPhoneRequired,
        },
        merchantInfo: merchantInfo,
        apiVersion: apiVersion,
        apiVersionMinor: apiVersionMinor,
        allowedPaymentMethods: allowedPaymentMethods,
        shippingOptionRequired: true,
        callbackIntents: ['SHIPPING_ADDRESS', 'SHIPPING_OPTION', 'PAYMENT_AUTHORIZATION'],
    };

    const paymentsClient = getPPCPGooglePaySession();
    paymentsClient?.loadPaymentData(paymentRequest);
}
