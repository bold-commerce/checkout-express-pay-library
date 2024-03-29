import {
    createBraintreeApple,
    getBraintreeClient,
    hasBraintreeClient,
    IBraintreeApplePayInstance,
    IBraintreeClientInstance,
    setBraintreeApplePayInstance,
    ApplePayLoadingError,
    getBraintreeAppleCredentialsChecked,
    IBraintreeClient,
} from 'src';

export async function braintreeOnLoadApple(): Promise<void> {
    if (hasBraintreeClient()) {
        const braintree = getBraintreeClient() as IBraintreeClient;
        const {tokenization_key: authorization} = getBraintreeAppleCredentialsChecked();

        try {
            const client = await braintree.client.create({authorization}) as IBraintreeClientInstance;
            const appleInstance = await braintree.applePay.create({client}) as IBraintreeApplePayInstance;
            setBraintreeApplePayInstance(appleInstance);
            createBraintreeApple();
        } catch (error) {
            if (error instanceof Error) {
                error.name = ApplePayLoadingError.name;
                throw error;
            }

            throw new ApplePayLoadingError(`Error loading Apple Pay: ${error}`);
        }
    }
}
