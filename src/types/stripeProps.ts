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

export interface IStripeCard {
    address_city: string,
    address_country: string,
    address_line1: string,
    address_line1_check: string,
    address_line2: string,
    address_state: string,
    address_zip: string,
    address_zip_check: string,
    brand: string,
    country: string,
    dynamic_last4: string,
    exp_month: number,
    exp_year: number,
    funding: string,
    id: string,
    last4: string,
    name: string,
    object: string,
    tokenization_method: string,
    currency: string,
    cvc_check: string,
}

export interface IStripeToken {
    client_ip: string,
    created: number,
    id: string,
    livemode: boolean,
    object: string,
    type: string,
    used: boolean,
    card: IStripeCard
}

export interface IStripeEvent {
    shippingAddress?: IStripeAddress,
    shippingOption?: IStripeShippingOptions,
    updateWith: (params: IStripeUpdateWithParam) => void
}


export interface IStripePaymentEvent {
    shippingAddress?: IStripeAddress,
    shippingOption?: IStripeShippingOptions,
    token?: IStripeToken,
    walletName?: string,
    payerEmail?: string,
    payerName?: string,
    payerPhone?: string,
    complete?: (status: string) => void,
    updateWith: (params: IStripeUpdateWithParam) => void
}
