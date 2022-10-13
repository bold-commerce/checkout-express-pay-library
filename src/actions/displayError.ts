import {actionTypes, getOnAction} from 'src';

export function displayError(message: string, section = '', term = ''): void{
    const onAction = getOnAction();
    const payload = {message, details: {section, term}};
    onAction && onAction(actionTypes.DISPLAY_ERROR, payload);
}
