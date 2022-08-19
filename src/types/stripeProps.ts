export interface IStripeAddress {
    city?: string,
    country?: string
    dependentLocality?: string
    organization?: string
    phone?: string
    postalCode?: string
    recipient: string
    region?: string
    sortingCode?: string
    addressLine?: Array<string>
}

export interface IStripePaymentItem {
    amount: number,
    label: string,
    pending?: boolean
}

export interface IStripeShippingOptions {
    id: string,
    amount: number,
    label: string,
    details?: string
}

export interface IStripeUpdateWithParam {
    status: 'success' | 'fail' | 'invalid_shipping_address',
    displayItems?: Array<IStripePaymentItem>,
    total?: IStripePaymentItem,
    shippingOptions?: Array<IStripeShippingOptions>
}

export interface IStripeEvent {
    shippingAddress?: IStripeAddress,
    shippingOption?: IStripeShippingOptions,
    updateWith: (params: IStripeUpdateWithParam) => void
}
