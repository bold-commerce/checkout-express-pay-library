import {IGetFirstAndLastName} from 'src';

export function getFirstAndLastName(payerName = ''): IGetFirstAndLastName {
    const names = payerName.split(' ');
    const firstName = names[0];
    const lastName = names.slice(1, names.length).join(' ');
    return {firstName, lastName};
}
