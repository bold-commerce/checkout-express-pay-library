# Interface: IBraintreeApplePayInstance

## Table of contents

### Methods

- [createPaymentRequest](IBraintreeApplePayInstance.md#createpaymentrequest)
- [performValidation](IBraintreeApplePayInstance.md#performvalidation)
- [tokenize](IBraintreeApplePayInstance.md#tokenize)

## Methods

### createPaymentRequest

▸ **createPaymentRequest**(`request`): `ApplePayPaymentRequest`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`IBraintreeApplePayPaymentRequest`](IBraintreeApplePayPaymentRequest.md) |

#### Returns

`ApplePayPaymentRequest`

___

### performValidation

▸ **performValidation**(`request`, `callback?`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`IBraintreeApplePayPerformValidationRequest`](IBraintreeApplePayPerformValidationRequest.md) |
| `callback?` | [`IBraintreeApplePayPerformValidationCallback`](../modules.md#ibraintreeapplepayperformvalidationcallback) |

#### Returns

`Promise`<`unknown`\>

___

### tokenize

▸ **tokenize**(`request`, `callback?`): `Promise`<[`IBraintreeApplePayPaymentAuthorizedResponse`](IBraintreeApplePayPaymentAuthorizedResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`IBraintreeApplePayPaymentAuthorizedRequest`](IBraintreeApplePayPaymentAuthorizedRequest.md) |
| `callback?` | [`IBraintreeApplePayPaymentAuthorizedCallback`](../modules.md#ibraintreeapplepaypaymentauthorizedcallback) |

#### Returns

`Promise`<[`IBraintreeApplePayPaymentAuthorizedResponse`](IBraintreeApplePayPaymentAuthorizedResponse.md)\>
