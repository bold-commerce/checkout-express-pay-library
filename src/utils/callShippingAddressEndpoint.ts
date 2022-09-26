import {
    baseReturnObject,
    getShippingAddress,
    IApiReturnObject,
    IFetchError,
    ISetShippingAddressRequest,
    setShippingAddress,
    updateShippingAddress,
} from '@bold-commerce/checkout-frontend-library';
import {API_RETRY, isAddressValid, isObjectEmpty, isObjectEquals} from 'src';

export async function callShippingAddressEndpoint(shippingAddress: ISetShippingAddressRequest, validate = true): Promise<IApiReturnObject> {
    const prevShippingAddress = getShippingAddress();
    const isPrevEmpty = isObjectEmpty(prevShippingAddress);
    const isEmpty = isObjectEmpty(shippingAddress);
    const isEqual = isObjectEquals(prevShippingAddress, shippingAddress);
    let success = true;

    if (validate && !isEmpty && !isEqual) {
        success = await isAddressValid(
            shippingAddress.country_code || '',
            shippingAddress.province_code || '',
            shippingAddress.postal_code || '',
            'shipping');
    }

    if (success) {
        if (isPrevEmpty && !isEqual) {
            return await setShippingAddress(shippingAddress, API_RETRY);
        } else {
            if (!isEqual) {
                return await updateShippingAddress(shippingAddress, API_RETRY);
            } else {
                success = true;
            }
        }
    }
    const error = !success ? new Error('Invalid Shipping Address') as IFetchError : null;
    return {...baseReturnObject, success, error};
}
