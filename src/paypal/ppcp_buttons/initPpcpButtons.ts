import {
    hasPaypalNameSpace,
    ppcpOnLoad,
    ppcpPayLaterCountryCurrency,
    ppcpTypeToFunding,
    setPaypalGatewayPublicId,
    setPaypalNameSpace
} from 'src';
import {PayPalScriptOptions} from '@paypal/paypal-js/types/script-options';
import {loadScript} from '@paypal/paypal-js';
import {getCurrency,IExpressPayPaypalCommercePlatformButton} from '@boldcommerce/checkout-frontend-library';


export async function initPpcpButtons(payment: IExpressPayPaypalCommercePlatformButton) {

    let components = 'buttons,applepay';
    const {iso_code: currency} = getCurrency();
    const merchantCountry = payment.merchant_country;
    setPaypalGatewayPublicId(payment.public_id);
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

    if (!hasPaypalNameSpace()) {

        const options: PayPalScriptOptions = {
            'clientId': payment.partner_id,
            currency,
            'enableFunding': ['card', 'credit', 'paylater', 'venmo'],
            'disableFunding': disableFunding,
            'commit': true,
            'intent': 'authorize',
            'merchantId': payment.merchant_id,
            'components': components
        };

        if (payment.is_dev) {
            options.buyerCountry = buyerCountry;
        }

        const paypal = await loadScript(options);
        setPaypalNameSpace(paypal);
        if (paypal) {
            await ppcpOnLoad(payment);
        }
    } else {
        await ppcpOnLoad(payment);
    }

}
