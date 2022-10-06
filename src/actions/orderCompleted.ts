import {actionTypes, getOnAction} from 'src';

export function orderCompleted(payload?: Record<string, unknown> ): void{
    const onAction = getOnAction(); //TODO if used by any payment gateway then please add it to documentation.
    onAction && onAction(actionTypes.ORDER_COMPLETED, payload);
}
