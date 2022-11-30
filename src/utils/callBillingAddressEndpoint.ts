import {
    baseReturnObject,
    getBillingAddress,
    IApiReturnObject,
    IFetchError,
    ISetBillingAddressRequest,
    setBillingAddress,
    updateBillingAddress,
} from '@bold-commerce/checkout-frontend-library';
import {API_RETRY, isAddressValid, isObjectEmpty, isObjectEquals} from 'src';

export async function callBillingAddressEndpoint(billingAddress: ISetBillingAddressRequest, validate = true): Promise<IApiReturnObject> {
    const prevBillingAddress = getBillingAddress();
    const isPrevEmpty = isObjectEmpty(prevBillingAddress);
    const isEmpty = isObjectEmpty(billingAddress);
    const isEqual = isObjectEquals(prevBillingAddress, billingAddress);
    let success = true;

    if (validate && !isEmpty && !isEqual) {
        success = await isAddressValid(
            billingAddress.country_code || '',
            billingAddress.province_code || '',
            billingAddress.postal_code || '',
            'billing');
    }

    if (success) {
        if (isPrevEmpty && !isEqual) {
            return await setBillingAddress(billingAddress, API_RETRY);
        } else {
            if (!isEqual) {
                return await updateBillingAddress(billingAddress, API_RETRY);
            } else {
                success = true;
            }
        }
    }
    const error = !success ? new Error('Invalid Billing Address') as IFetchError : null;
    return {...baseReturnObject, success, error};
}
