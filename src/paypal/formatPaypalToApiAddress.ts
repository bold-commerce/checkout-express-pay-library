import {ISetShippingAddressRequest} from '@bold-commerce/checkout-frontend-library';
import {ShippingAddress} from '@paypal/paypal-js/types/apis/shipping';
import {getCountryAndProvince} from 'src/utils/getCountryAndProvince';
import {Address} from '@paypal/paypal-js/types/apis/commons';

export function formatPaypalToApiAddress(address?: ShippingAddress | Address, firstName = '', lastName = '', phone = ''): ISetShippingAddressRequest {
    const {city, country_code, state, postal_code} = (address || {}) as ShippingAddress;
    const {address_line_1, address_line_2, admin_area_1, admin_area_2} = (address || {}) as Address;
    const provinceKey = state || admin_area_1;
    const addressCity = city || admin_area_2;
    const {country, province} = getCountryAndProvince(
        country_code || '',
        provinceKey || '');

    return {
        address_line_1: address_line_1 || '',
        address_line_2: address_line_2 || '',
        business_name: '',
        city: addressCity || '',
        country: country?.name || '',
        country_code: country?.iso_code || '',
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        postal_code: postal_code || '',
        province: province?.name || '',
        province_code: province?.iso_code || ''
    };
}
