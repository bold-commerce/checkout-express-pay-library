import {actionTypes, getOnAction} from 'src';

export function orderProcessing(payload?: Record<string, unknown> ): void{
    const onAction = getOnAction();
    onAction && onAction(actionTypes.ORDER_PROCESSING, payload);
}
