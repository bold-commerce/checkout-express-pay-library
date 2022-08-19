import {IShowPaymentMethods, showPaymentMethods} from 'src';

export function showHideExpressPaySection(type: string, show: boolean, initShowHideCallback?: (show: boolean) => void): void {
    const methodsKeys: Array<string> = Object.keys(showPaymentMethods);

    if (methodsKeys.includes(type)) {
        showPaymentMethods[type as keyof IShowPaymentMethods] = show;

        if (initShowHideCallback) {
            initShowHideCallback(isShowExpressPayEnabled());
        }
    }
}

export function isShowExpressPayEnabled(): boolean {
    return Object.values(showPaymentMethods).some(value => value === true);
}
