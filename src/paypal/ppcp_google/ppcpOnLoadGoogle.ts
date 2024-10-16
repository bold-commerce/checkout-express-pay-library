import {
    getPaypalNameSpace,
    getPPCPGoogleCredentialsChecked,
    GooglePayLoadingError,
    hasPaypalNameSpaceGoogle,
    IPaypalNamespaceGoogle,
    setPPCPGooglePayConfig,
    setPPCPGooglePaySession,
    setPPCPGooglePayInstance,
    createPPCPGoogle,
    ppcpOnPaymentAuthorizedGoogle,
    ppcpOnPaymentDataChangeGoogle
} from 'src';

export async function ppcpOnLoadGoogle(): Promise<void>  {
    if (hasPaypalNameSpaceGoogle()) {
        const paypal = getPaypalNameSpace() as IPaypalNamespaceGoogle;

        try {
            const googlePay = paypal.Googlepay();
            const googlePayConfig = await googlePay.config();
            const is_test = getPPCPGoogleCredentialsChecked();
            setPPCPGooglePayInstance(googlePay);
            setPPCPGooglePayConfig(googlePayConfig);

            const { allowedPaymentMethods, apiVersion, apiVersionMinor } = googlePayConfig;

            const googlePaySession = new google.payments.api.PaymentsClient({
                environment: is_test ? 'TEST' : 'PRODUCTION',
                paymentDataCallbacks: {
                    onPaymentAuthorized: ppcpOnPaymentAuthorizedGoogle,
                    onPaymentDataChanged: ppcpOnPaymentDataChangeGoogle
                }
            });

            setPPCPGooglePaySession(googlePaySession);
            googlePaySession.isReadyToPay({allowedPaymentMethods, apiVersion,apiVersionMinor})
                .then(function(response) {
                    if (response.result) {
                        createPPCPGoogle();
                    }
                });

        } catch (error) {
            if (error instanceof Error) {
                error.name = GooglePayLoadingError.name;
                throw error;
            }

            throw new GooglePayLoadingError(`Error loading Google Pay: ${error}`);
        }
    }
}
