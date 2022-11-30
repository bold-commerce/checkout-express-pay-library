import {actionTypes, getOnAction, IShowPaymentMethods, showPaymentMethods} from 'src';

export function enableDisableSection(type: string, show: boolean): void {
    const methodsKeys: Array<string> = Object.keys(showPaymentMethods);
    const onAction = getOnAction();

    if (methodsKeys.includes(type)) {
        showPaymentMethods[type as keyof IShowPaymentMethods] = show;

        if (onAction) {
            onAction(actionTypes.ENABLE_DISABLE_SECTION, {show: isSectionEnabled()});
        }
    }
}

export function isSectionEnabled(): boolean {
    return Object.values(showPaymentMethods).some(value => value === true);
}
