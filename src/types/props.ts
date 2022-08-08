
declare global {
    interface Window {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        [key:string]: any;
    }
}


export interface IInitializeProps {
    showHideExpressPaymentSection?: (show: boolean) => void
}
