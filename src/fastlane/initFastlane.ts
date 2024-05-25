import { getPublicOrderId, getEnvironment, getShopIdentifier, getJwtToken, getOrderInitialData, alternatePaymentMethodType, IExpressPayPaypalCommercePlatformButton } from '@boldcommerce/checkout-frontend-library';
import {
    loadJS,
    getBraintreeJsUrls,
    braintreeOnLoadClient,
    IFastlaneInstance,
    getBraintreeClient,
    IBraintreeClient,
    FastlaneLoadingError,
    IFastlaneOptions,
    getPaypalNameSpacePromise,
    initPpcpSdk,
    getPaypalNameSpace,
} from 'src';
import Fastlane from './fastlane';

interface TokenResponse {
    is_test_mode: boolean;
    client_token: string;
    gateway_public_id: string;
    type: IFastlaneInstance['type'];
}

interface BraintreeTokenResponse extends TokenResponse {
    type: 'braintree';
    client_id: null;
}

export async function initFastlane(options?: IFastlaneOptions): Promise<IFastlaneInstance>  {
    const {clientJsURL, dataCollectorJsURL, fastlaneJsURL} = getBraintreeJsUrls('3.101.0-fastlane-beta.7.2');
    const {alternative_payment_methods} = getOrderInitialData();
    const payment = alternative_payment_methods
        .find(payment => payment.type === alternatePaymentMethodType.PPCP) as IExpressPayPaypalCommercePlatformButton | undefined;

    try {
        const type = payment ? 'ppcp' : 'braintree';

        if (type === 'braintree') {
            // TODO move this request to the checkout frontend library
            const env = getEnvironment();
            const shopId = getShopIdentifier();
            const publicOrderId = getPublicOrderId();
            const jwt = getJwtToken();
            const resp = await fetch(`${env.url}/checkout/storefront/${shopId}/${publicOrderId}/paypal_fastlane/client_token`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            
            // Getting client token and which SDK to use
            const {
                client_token: clientToken,
                gateway_public_id: gatewayPublicId,
            } = await resp.json().then(r => r.data) as BraintreeTokenResponse;
            await Promise.all([
                loadJS(clientJsURL),
                loadJS(fastlaneJsURL),
                loadJS(dataCollectorJsURL),
            ]).then(braintreeOnLoadClient);

            const braintree = getBraintreeClient() as IBraintreeClient;
            const client = await braintree.client.create({authorization: clientToken});
            const dataCollector = await braintree.dataCollector.create({
                client: client,
                riskCorrelationId: getPublicOrderId(),
            });

            const fastlane = await braintree.fastlane.create({
                client,
                authorization: clientToken,
                deviceData: dataCollector.deviceData,
                styles: options?.styles
            });

            return new Fastlane(fastlane, 'braintree', gatewayPublicId);
        }

        // It should be impossible for PPCP to be the type and no PPCP gateway entry to be in 
        // in initialData.alternative_payment_gateway
        /* istanbul ignore next */
        if (!payment) { 
            throw new Error('Unreachable: PPCP type but no PPCP gateway found');
        }

        type FastlaneType = {Fastlane: (options?: IFastlaneOptions) => Promise<IFastlaneInstance>}
        let paypal = getPaypalNameSpace() as unknown as FastlaneType;
        const paypalPromise = getPaypalNameSpacePromise();
        if (!paypal && !paypalPromise) {
            await initPpcpSdk(payment, true);
        } else if (!paypal) {
            await paypalPromise;
        }
        
        paypal = getPaypalNameSpace() as unknown as FastlaneType;
        /* istanbul ignore next */
        if (!paypal?.Fastlane) {
            throw new Error('Unreconcilable: Paypal SDK instance does not have Fastlane method');
        }
        
        const fastlane = await paypal.Fastlane(options);
        return new Fastlane(fastlane, type, payment.public_id);
    } catch (error) {
        if (error instanceof Error) {
            error.name = FastlaneLoadingError.name;
            throw error;
        }

        throw new FastlaneLoadingError(`Error loading Fastlane: ${error}`);
    }
}
