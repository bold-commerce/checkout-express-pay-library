import {
    actionTypes,
    getOnAction,
} from 'src';

export async function braintreeOnCancelApple(): Promise<void> {
    const onAction = getOnAction();
    if (onAction) {
        onAction(actionTypes.REFRESH_ORDER, {});
    }
}
