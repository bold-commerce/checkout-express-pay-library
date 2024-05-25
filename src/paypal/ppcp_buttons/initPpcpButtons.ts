import {
    getPaypalNameSpacePromise,
    hasPaypalNameSpace,
    ppcpOnLoad,
    ppcpPayLaterCountryCurrency,
    ppcpTypeToFunding,
    setPaypalGatewayPublicId,
    setPaypalNameSpace,
    setPaypalNameSpacePromise,
} from 'src';
import {PayPalScriptOptions} from '@paypal/paypal-js/types/script-options';
import {loadScript, PayPalNamespace} from '@paypal/paypal-js';
import {getCurrency,getEnvironment,getJwtToken,getPublicOrderId,getShopIdentifier,IExpressPayPaypalCommercePlatformButton} from '@boldcommerce/checkout-frontend-library';

async function initPpcpSdkInternal(payment: IExpressPayPaypalCommercePlatformButton, /* istanbul ignore next */ fastlane = false): Promise<PayPalNamespace | null> {
    let components = `buttons,applepay${fastlane ? ',fastlane' : ''}`;
    const {iso_code: currency} = getCurrency();
    const merchantCountry = payment.merchant_country;
    let buyerCountry = '';

    const countryEligibleForPaylater = Boolean(ppcpPayLaterCountryCurrency[merchantCountry]);
    const payLaterEligibleCountryMatchesCurrency = ppcpPayLaterCountryCurrency[merchantCountry] === currency;
    if (countryEligibleForPaylater && payLaterEligibleCountryMatchesCurrency) {
        buyerCountry = merchantCountry;
        if (payment.payment_types.paylaterMessages) {
            components = components.concat(',messages');
        }
    }

    const disableFunding = ['card'];
    for (const type in ppcpTypeToFunding) {
        const fundingType = ppcpTypeToFunding[type];
        if (payment.payment_types[type] === false) {
            disableFunding.push(fundingType);
        }
    }

    const options: PayPalScriptOptions = {
        clientId: payment.partner_id,
        currency,
        enableFunding: ['card', 'credit', 'paylater', 'venmo'],
        disableFunding: disableFunding,
        commit: true,
        intent: 'authorize',
        merchantId: payment.merchant_id,
        components: components,
        dataPartnerAttributionId: payment.is_dev? 'Bold_SP_PPCP_TEST' : 'Bold_SP_PPCP',
    };

    if (fastlane) {
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
        const { client_token: clientToken } = await resp.json().then(r => r.data);
        options.dataUserIdToken = clientToken;
    }

    if (payment.is_dev) {
        options.buyerCountry = buyerCountry;
    }

    const paypal = await loadScript(options);
    setPaypalNameSpace(paypal);

    return paypal;
}

/**
 * Initializes Paypal SDK. No attempt will be made to determine if the SDK is loaded already. As soon as function is called
 * setPaypalNameSpacePromise will be called with a promise that will resolve into a `PaypalNamespace` or `null`. Caller should
 * check if an initialization is in-flight by calling `getPaypalNameSpacePromise` and awaiting any promise returned before
 * calling this function to avoid double initialization.
 */
export async function initPpcpSdk(payment: IExpressPayPaypalCommercePlatformButton, /* istanbul ignore next */ fastlane = false): Promise<void> {
    const promise = new Promise<PayPalNamespace | null>((resolve, reject) => {
        initPpcpSdkInternal(payment, fastlane).then(resolve, reject);
    });

    setPaypalNameSpacePromise(promise);
    await promise;
}

export async function initPpcpButtons(payment: IExpressPayPaypalCommercePlatformButton, fastlane = false): Promise<void> {
    setPaypalGatewayPublicId(payment.public_id);
    const namespacePromise = getPaypalNameSpacePromise();
    const hasNamespace = hasPaypalNameSpace();
    if (!hasNamespace && !namespacePromise) {
        await initPpcpSdk(payment, fastlane);
    } else if (!hasNamespace) {
        await namespacePromise;
    }

    if (!hasPaypalNameSpace()) {
        return;
    }

    await ppcpOnLoad(payment);
}
