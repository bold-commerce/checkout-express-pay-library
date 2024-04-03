import {IOnAction} from 'src/types/variables';

declare global {
    interface Window {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        [key:string]: any;
    }
}

export interface IInitializeProps {
    onAction: IOnAction;
}

export interface IGetFirstAndLastName {
    firstName: string;
    lastName: string;
}
