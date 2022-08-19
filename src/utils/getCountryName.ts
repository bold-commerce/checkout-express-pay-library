import {getOrderInitialData} from '@bold-commerce/checkout-frontend-library';

export function getCountryName(iso_code: string): string {
    const {country_info} = getOrderInitialData();
    const countryInfo = country_info.find(o => o.iso_code === iso_code);
    return countryInfo?.name ?? '';
}
