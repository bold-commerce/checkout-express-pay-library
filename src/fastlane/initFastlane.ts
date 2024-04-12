import { getPublicOrderId, getEnvironment, getShopIdentifier, getJwtToken } from '@boldcommerce/checkout-frontend-library';
import { loadScript } from '@paypal/paypal-js';
import {
    loadJS,
    getBraintreeJsUrls,
    braintreeOnLoadClient,
    IFastlaneInstance,
    getBraintreeClient,
    IBraintreeClient,
    FastlaneLoadingError,
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

interface PPCPTokenResponse extends TokenResponse {
    type: 'ppcp';
    client_id: string;
}

export async function initFastlane(): Promise<IFastlaneInstance>  {
    const {clientJsURL, dataCollectorJsURL, fastlaneJsURL} = getBraintreeJsUrls('3.101.0-fastlane-beta.7.2');

    try {
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
            client_id: clientId,
            type,
            is_test_mode: isTest,
            gateway_public_id: gatewayPublicId,
        } = await resp.json().then(r => r.data) as BraintreeTokenResponse | PPCPTokenResponse;
        
        let fastlane: IFastlaneInstance;
        switch (type) {
            case 'braintree': {
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
                fastlane = await braintree.fastlane.create({
                    client,
                    authorization: clientToken,
                    deviceData: dataCollector.deviceData,
                });

                break;
            }
            case 'ppcp': {
                const paypal = await loadScript({
                    dataUserIdToken: clientToken,
                    clientId: clientId,
                    components: 'fastlane',
                    debug: isTest,
                }) as unknown as {Fastlane: () => Promise<IFastlaneInstance>};
                fastlane = await paypal.Fastlane();

                break;
            }
            default:
                throw new Error(`unknown type: ${type}`);
        }

        return new Fastlane(fastlane, type, gatewayPublicId);
    } catch (error) {
        if (error instanceof Error) {
            error.name = FastlaneLoadingError.name;
            throw error;
        }

        throw new FastlaneLoadingError(`Error loading Fastlane: ${error}`);
    }
}
