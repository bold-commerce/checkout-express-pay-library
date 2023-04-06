import {
    ApplePayLoadingError,
    getPaypalNameSpace,
    hasPaypalNameSpaceApple,
    IPaypalNamespaceApple,
    setPPCPApplePayInstance
} from 'src';

export async function ppcpOnLoadApple(): Promise<void>  {
    if (hasPaypalNameSpaceApple()) {
        const paypal = getPaypalNameSpace() as IPaypalNamespaceApple;

        try {
            const applePay = paypal.Applepay();
            const applePayConfig = await applePay.config();
            setPPCPApplePayInstance(applePay);
            if (applePayConfig.isEligible) {
                /*TODO Add call to createPaypalApple() when implemented*/
            }
        } catch (error) {
            if (error instanceof Error) {
                error.name = ApplePayLoadingError.name;
                throw error;
            }

            throw new ApplePayLoadingError(`Error loading Apple Pay: ${error}`);
        }
    }
}
