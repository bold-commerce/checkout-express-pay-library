import {validateAddress} from '@bold-commerce/checkout-frontend-library';
import {getCountryAndProvince} from 'src/utils/getCountryAndProvince';
import {API_RETRY} from 'src';

export async function isAddressValid(countryKey: string, provinceKey: string, postalCode: string, type: 'shipping' | 'billing'): Promise<boolean> {
    const {country, province} = getCountryAndProvince(countryKey, provinceKey);

    if(!country
        || (type === 'shipping' && !country.valid_for_shipping)
        || (type === 'billing' && !country.valid_for_billing)) {
        return false;
    }

    if (country.show_province) {
        if (!province
            || (type === 'shipping' && !province.valid_for_shipping)
            || (type === 'billing' && !province.valid_for_billing)) {
            return false;
        }
    }

    const validateRes = await validateAddress(
        postalCode,
        province?.name || '',
        province?.iso_code || '',
        country.name,
        country.iso_code,
        '',
        '',
        API_RETRY);

    return validateRes.success;
}
