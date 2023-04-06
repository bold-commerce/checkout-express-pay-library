import {
    braintreeConstants,
    braintreeOnPaymentAuthorizedGoogle,
    braintreeOnPaymentDataChangeGoogle,
    createBraintreeGoogle,
    getBraintreeClient,
    getBraintreeGoogleCredentialsChecked,
    GooglePayLoadingError,
    hasBraintreeClient,
    IBraintreeClientInstance,
    IBraintreeGooglePayInstance,
    setBraintreeGooglePayClient,
    setBraintreeGooglePayInstance,
} from 'src';
import {getOrderInitialData} from '@bold-commerce/checkout-frontend-library';

export async function braintreeOnLoadGoogle(): Promise<void> {
    if (!window.google) {
        return;
    }

    const {
        google_pay_merchant_identifier: googleMerchantId,
        tokenization_key: authorization,
        is_test: isTest
    } = getBraintreeGoogleCredentialsChecked();
    const {shop_name: shopName} = getOrderInitialData();

    const paymentsClient = new google.payments.api.PaymentsClient({
        environment: isTest ? 'TEST' : 'PRODUCTION',
        merchantInfo: {
            merchantId: googleMerchantId || '',
            merchantName: shopName
        },
        paymentDataCallbacks: {
            onPaymentAuthorized: braintreeOnPaymentAuthorizedGoogle,
            onPaymentDataChanged: braintreeOnPaymentDataChangeGoogle
        }
    });
    setBraintreeGooglePayClient(paymentsClient);

    if (hasBraintreeClient()) {
        const braintree = getBraintreeClient();

        try {
            const client = await braintree?.client.create({authorization}) as IBraintreeClientInstance;
            const googleInstance = await braintree?.googlePayment.create({
                client,
                googleMerchantId,
                googlePayVersion: braintreeConstants.GOOGLEPAY_VERSION_NUMBER
            }) as IBraintreeGooglePayInstance;
            setBraintreeGooglePayInstance(googleInstance);
            await createBraintreeGoogle();
        } catch (error) {
            if (error instanceof Error) {
                error.name = GooglePayLoadingError.name;
                throw error;
            }

            throw new GooglePayLoadingError(`Error loading Google Pay: ${error}`);
        }
    }
}
