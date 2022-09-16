import {ISetShippingAddressRequest} from '@bold-commerce/checkout-frontend-library';
import {ShippingAddress} from '@paypal/paypal-js/types/apis/shipping';
import {getCountryAndProvince} from 'src/utils/getCountryAndProvince';

export function formatPaypalToApiAddress(address: ShippingAddress|undefined): ISetShippingAddressRequest {
    const {country, province} = getCountryAndProvince(
        address?.country_code || '',
        address?.state || '');

    return {
        address_line_1: '',
        address_line_2: '',
        business_name: '',
        city: address?.city || '',
        country: country?.name || '',
        country_code: country?.iso_code || '',
        first_name: '',
        last_name: '',
        phone_number: '',
        postal_code: address?.postal_code || '',
        province: province?.name || '',
        province_code: province?.iso_code || ''
    };
}
