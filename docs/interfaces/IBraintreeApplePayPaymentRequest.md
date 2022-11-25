# Interface: IBraintreeApplePayPaymentRequest

## Table of contents

### Properties

- [currencyCode](IBraintreeApplePayPaymentRequest.md#currencycode)
- [lineItems](IBraintreeApplePayPaymentRequest.md#lineitems)
- [requiredBillingContactFields](IBraintreeApplePayPaymentRequest.md#requiredbillingcontactfields)
- [requiredShippingContactFields](IBraintreeApplePayPaymentRequest.md#requiredshippingcontactfields)
- [total](IBraintreeApplePayPaymentRequest.md#total)

## Properties

### currencyCode

• **currencyCode**: `string`

___

### lineItems

• **lineItems**: { `amount`: `string` ; `label`: `string`  }[]

___

### requiredBillingContactFields

• **requiredBillingContactFields**: [`IBraintreeRequiredContactField`](../modules.md#ibraintreerequiredcontactfield)

___

### requiredShippingContactFields

• **requiredShippingContactFields**: [`IBraintreeRequiredContactField`](../modules.md#ibraintreerequiredcontactfield)

___

### total

• **total**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `string` |
| `label` | `string` |
