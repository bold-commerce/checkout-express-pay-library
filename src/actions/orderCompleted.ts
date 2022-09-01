import {actionTypes, getOnAction} from 'src';

export function orderCompleted(payload?: Record<string, unknown> ): void{
    const onAction = getOnAction();
    onAction && onAction(actionTypes.ORDER_COMPLETED, payload);
}
