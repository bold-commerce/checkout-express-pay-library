import {IAddress} from '@bold-commerce/checkout-frontend-library';
import {getCountryName, getFirstAndLastName, getProvinceDetails, IStripeAddress} from 'src';

export function formatStripeShippingAddress(address: IStripeAddress): IAddress {
    const countryIso = address.country ?? '';
    const region = address.region ?? '';
    const {code: provinceCode, name: provinceName} = getProvinceDetails(countryIso,region);
    const countryName = getCountryName(countryIso);
    const {firstName, lastName} = getFirstAndLastName(address.recipient);

    const formattedAddress = {
        'first_name': firstName,
        'last_name': lastName,
        'address_line_1': (address.addressLine && address.addressLine[0])? address.addressLine[0] : '',
        'address_line_2':(address.addressLine && address.addressLine[1])? address.addressLine[1] : '',
        'country': countryName,
        'city': address.city ?? '',
        'province':provinceName,
        'country_code': countryIso,
        'province_code': provinceCode,
        'postal_code': address.postalCode?? '',
        'business_name': address.organization?? '',
        'phone_number': address.phone ?? ''
    };

    if (formattedAddress.postal_code.length <= 4 && formattedAddress.country_code === 'CA') {
        formattedAddress.postal_code += '1A1'; //adding default postal code because stripe only provide first 3 digits until the payment is done.
    }

    return formattedAddress;

}
