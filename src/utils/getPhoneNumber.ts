import {getOrderInitialData} from '@bold-commerce/checkout-frontend-library';
import {isObjectEmpty} from 'src';

export function getPhoneNumber(phone = ''): string {
    const {general_settings} = getOrderInitialData();
    if(general_settings.checkout_process.phone_number_required && isObjectEmpty({phone})){
        return '1111111111';
    } else {
        return phone;
    }
}
