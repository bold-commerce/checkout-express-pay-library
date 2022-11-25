# Interface: IBraintreeGooglePayInstance

## Table of contents

### Methods

- [createPaymentDataRequest](IBraintreeGooglePayInstance.md#createpaymentdatarequest)
- [parseResponse](IBraintreeGooglePayInstance.md#parseresponse)

## Methods

### createPaymentDataRequest

▸ **createPaymentDataRequest**(`request?`): `PaymentDataRequest`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request?` | [`IBraintreeGooglePayPaymentRequest`](IBraintreeGooglePayPaymentRequest.md) |

#### Returns

`PaymentDataRequest`

___

### parseResponse

▸ **parseResponse**(`request`): `Promise`<[`IBraintreeGooglePayPaymentData`](IBraintreeGooglePayPaymentData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `PaymentData` |

#### Returns

`Promise`<[`IBraintreeGooglePayPaymentData`](IBraintreeGooglePayPaymentData.md)\>
