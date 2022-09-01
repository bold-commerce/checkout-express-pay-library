import {expressPayContext, IOnAction} from 'src';

export function setOnAction(onAction: IOnAction | null): void {
    expressPayContext.onAction = onAction;
}

export function getOnAction(): IOnAction | null {
    return expressPayContext.onAction;
}
