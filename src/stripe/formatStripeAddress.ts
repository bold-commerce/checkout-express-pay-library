import {IAddress} from '@bold-commerce/checkout-frontend-library';
import {IStripeAddress} from 'src/types/stripeProps';
import {getCountryName, getProvinceDetails} from 'src/utils';


export function formatStripeAddress(address: IStripeAddress): IAddress {
    const countryIso = address.country ?? '';
    const region = address.region ?? '';
    const {code: provinceCode, name: provinceName} = getProvinceDetails(countryIso,region);
    const countryName = getCountryName(countryIso);

    const name = address.recipient.split(/ /);
    const firstName = name[0];
    let lastName = '';
    if (name.length >= 1) {
        lastName = name.slice(1, name.length).join(' ');
    }

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
        formattedAddress.postal_code += '1A1';
    }

    return formattedAddress;

}
