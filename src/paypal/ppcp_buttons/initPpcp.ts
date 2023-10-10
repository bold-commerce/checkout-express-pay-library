import {IExpressPayPaypalCommercePlatform} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {

    hasPaypalNameSpace,
    IOnAction, ppcpOnLoad,
    setOnAction,
    setPaypalGatewayPublicId, setPaypalNameSpace
} from 'src';
import {PayPalScriptOptions} from '@paypal/paypal-js/types/script-options';
import {loadScript} from '@paypal/paypal-js';
import {getCurrency} from '@boldcommerce/checkout-frontend-library';


export interface IPaypalCommercePlatform extends IExpressPayPaypalCommercePlatform  {
    'is_3ds_enabled': boolean,
    'apple_pay_enabled': boolean,
}

export async function initPpcp(payment: IPaypalCommercePlatform, callback?: IOnAction) {

    if (callback) {
        setOnAction(callback);
    }

    const {iso_code: currency} = getCurrency();
    setPaypalGatewayPublicId(payment.public_id);

    if (!hasPaypalNameSpace()) {
        const options: PayPalScriptOptions = {
            'client-id': payment.partner_id,
            debug: payment.is_test,
            currency,
            'enable-funding': 'credit,paylater,venmo',
            //'disable-funding': 'card',
            'vault': true,
            'commit': true,
            'intent': 'authorize',
            'merchant-id': payment.merchant_id,
            'components': 'buttons'};

        const paypal = await loadScript(options);

        setPaypalNameSpace(paypal);

        if (paypal) {
            await ppcpOnLoad(payment);
        }
    } else {
        await ppcpOnLoad(payment);
    }

}
