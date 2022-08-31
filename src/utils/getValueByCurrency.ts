import {getFormattedValue} from 'src';

export function getValueByCurrency(value: number, currencyCode: string): string {
    if (!currencyCode) {
        return value.toString();
    }
    switch (currencyCode) {
        case 'HUF':
        case 'TWD':
        case 'JPY':
            return getFormattedValue(value, 0, '', '');
            // TODO: Explore the possibility of using Intl.NumberFormat browser functionality instead.
        default:
            return getFormattedValue(value, 2, '.', '');
        // TODO: Explore the possibility of using Intl.NumberFormat browser functionality instead.
    }
}
