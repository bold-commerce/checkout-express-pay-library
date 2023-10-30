# @boldcommerce/checkout-express-pay-library

## Table of contents

### Classes

- [ApplePayLoadingError](classes/ApplePayLoadingError.md)
- [ApplePayValidateMerchantError](classes/ApplePayValidateMerchantError.md)
- [BraintreeNullStateKeyError](classes/BraintreeNullStateKeyError.md)
- [GooglePayLoadingError](classes/GooglePayLoadingError.md)
- [PaypalNullStateKeyError](classes/PaypalNullStateKeyError.md)

### Interfaces

- [IActionTypes](interfaces/IActionTypes.md)
- [IApplePayConstants](interfaces/IApplePayConstants.md)
- [IBraintreeApplePayCreateRequest](interfaces/IBraintreeApplePayCreateRequest.md)
- [IBraintreeApplePayInstance](interfaces/IBraintreeApplePayInstance.md)
- [IBraintreeApplePayPaymentAuthorizedRequest](interfaces/IBraintreeApplePayPaymentAuthorizedRequest.md)
- [IBraintreeApplePayPaymentAuthorizedResponse](interfaces/IBraintreeApplePayPaymentAuthorizedResponse.md)
- [IBraintreeApplePayPaymentRequest](interfaces/IBraintreeApplePayPaymentRequest.md)
- [IBraintreeApplePayPerformValidationRequest](interfaces/IBraintreeApplePayPerformValidationRequest.md)
- [IBraintreeClient](interfaces/IBraintreeClient.md)
- [IBraintreeClientCreateRequest](interfaces/IBraintreeClientCreateRequest.md)
- [IBraintreeConstants](interfaces/IBraintreeConstants.md)
- [IBraintreeGooglePayCreateRequest](interfaces/IBraintreeGooglePayCreateRequest.md)
- [IBraintreeGooglePayInstance](interfaces/IBraintreeGooglePayInstance.md)
- [IBraintreeGooglePayPaymentData](interfaces/IBraintreeGooglePayPaymentData.md)
- [IBraintreeGooglePayPaymentRequest](interfaces/IBraintreeGooglePayPaymentRequest.md)
- [IBraintreeState](interfaces/IBraintreeState.md)
- [IBraintreeUrls](interfaces/IBraintreeUrls.md)
- [IExpressPayContext](interfaces/IExpressPayContext.md)
- [IGetFirstAndLastName](interfaces/IGetFirstAndLastName.md)
- [IInitializeProps](interfaces/IInitializeProps.md)
- [IPPCPAppleConfig](interfaces/IPPCPAppleConfig.md)
- [IPPCPApplePayInstance](interfaces/IPPCPApplePayInstance.md)
- [IPPCPApplePayInstanceConfirmOrderParam](interfaces/IPPCPApplePayInstanceConfirmOrderParam.md)
- [IPPCPApplePayInstanceValidateMerchantParam](interfaces/IPPCPApplePayInstanceValidateMerchantParam.md)
- [IPPCPApplePayValidateMerchantResponse](interfaces/IPPCPApplePayValidateMerchantResponse.md)
- [IPaypalConstants](interfaces/IPaypalConstants.md)
- [IPaypalNamespaceApple](interfaces/IPaypalNamespaceApple.md)
- [IPaypalPatchOperation](interfaces/IPaypalPatchOperation.md)
- [IPaypalState](interfaces/IPaypalState.md)
- [IShowPaymentMethodTypes](interfaces/IShowPaymentMethodTypes.md)
- [IShowPaymentMethods](interfaces/IShowPaymentMethods.md)
- [IStripeAddress](interfaces/IStripeAddress.md)
- [IStripeCard](interfaces/IStripeCard.md)
- [IStripeEvent](interfaces/IStripeEvent.md)
- [IStripePaymentEvent](interfaces/IStripePaymentEvent.md)
- [IStripePaymentItem](interfaces/IStripePaymentItem.md)
- [IStripeShippingOptions](interfaces/IStripeShippingOptions.md)
- [IStripeToken](interfaces/IStripeToken.md)
- [IStripeUpdateWithParam](interfaces/IStripeUpdateWithParam.md)
- [ITotals](interfaces/ITotals.md)

### Type Aliases

- [IBraintreeApplePayCreate](modules.md#ibraintreeapplepaycreate)
- [IBraintreeApplePayCreateCallback](modules.md#ibraintreeapplepaycreatecallback)
- [IBraintreeApplePayPaymentAuthorizedCallback](modules.md#ibraintreeapplepaypaymentauthorizedcallback)
- [IBraintreeApplePayPerformValidationCallback](modules.md#ibraintreeapplepayperformvalidationcallback)
- [IBraintreeClientCreate](modules.md#ibraintreeclientcreate)
- [IBraintreeClientCreateCallback](modules.md#ibraintreeclientcreatecallback)
- [IBraintreeClientInstance](modules.md#ibraintreeclientinstance)
- [IBraintreeGooglePayCreate](modules.md#ibraintreegooglepaycreate)
- [IBraintreeGooglePayCreateCallback](modules.md#ibraintreegooglepaycreatecallback)
- [IBraintreeRequiredContactField](modules.md#ibraintreerequiredcontactfield)
- [IOnAction](modules.md#ionaction)

### Variables

- [API\_RETRY](modules.md#api_retry)

## Type Aliases

### IBraintreeApplePayCreate

Ƭ **IBraintreeApplePayCreate**: (`request`: [`IBraintreeApplePayCreateRequest`](interfaces/IBraintreeApplePayCreateRequest.md), `callback?`: [`IBraintreeApplePayCreateCallback`](modules.md#ibraintreeapplepaycreatecallback)) => [`IBraintreeApplePayInstance`](interfaces/IBraintreeApplePayInstance.md)

#### Type declaration

▸ (`request`, `callback?`): [`IBraintreeApplePayInstance`](interfaces/IBraintreeApplePayInstance.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`IBraintreeApplePayCreateRequest`](interfaces/IBraintreeApplePayCreateRequest.md) |
| `callback?` | [`IBraintreeApplePayCreateCallback`](modules.md#ibraintreeapplepaycreatecallback) |

##### Returns

[`IBraintreeApplePayInstance`](interfaces/IBraintreeApplePayInstance.md)

___

### IBraintreeApplePayCreateCallback

Ƭ **IBraintreeApplePayCreateCallback**: (`error`: `string` \| `Error` \| `undefined`, `instance`: [`IBraintreeApplePayInstance`](interfaces/IBraintreeApplePayInstance.md)) => `void`

#### Type declaration

▸ (`error`, `instance`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `string` \| `Error` \| `undefined` |
| `instance` | [`IBraintreeApplePayInstance`](interfaces/IBraintreeApplePayInstance.md) |

##### Returns

`void`

___

### IBraintreeApplePayPaymentAuthorizedCallback

Ƭ **IBraintreeApplePayPaymentAuthorizedCallback**: (`error`: `string` \| `Error` \| `undefined`, `payload`: [`IBraintreeApplePayPaymentAuthorizedResponse`](interfaces/IBraintreeApplePayPaymentAuthorizedResponse.md) \| `undefined`) => `void`

#### Type declaration

▸ (`error`, `payload`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `string` \| `Error` \| `undefined` |
| `payload` | [`IBraintreeApplePayPaymentAuthorizedResponse`](interfaces/IBraintreeApplePayPaymentAuthorizedResponse.md) \| `undefined` |

##### Returns

`void`

___

### IBraintreeApplePayPerformValidationCallback

Ƭ **IBraintreeApplePayPerformValidationCallback**: (`error`: `string` \| `Error` \| `undefined`, `merchantSession`: `unknown`) => `void`

#### Type declaration

▸ (`error`, `merchantSession`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `string` \| `Error` \| `undefined` |
| `merchantSession` | `unknown` |

##### Returns

`void`

___

### IBraintreeClientCreate

Ƭ **IBraintreeClientCreate**: (`request`: [`IBraintreeClientCreateRequest`](interfaces/IBraintreeClientCreateRequest.md), `callback?`: [`IBraintreeClientCreateCallback`](modules.md#ibraintreeclientcreatecallback)) => [`IBraintreeClientInstance`](modules.md#ibraintreeclientinstance)

#### Type declaration

▸ (`request`, `callback?`): [`IBraintreeClientInstance`](modules.md#ibraintreeclientinstance)

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`IBraintreeClientCreateRequest`](interfaces/IBraintreeClientCreateRequest.md) |
| `callback?` | [`IBraintreeClientCreateCallback`](modules.md#ibraintreeclientcreatecallback) |

##### Returns

[`IBraintreeClientInstance`](modules.md#ibraintreeclientinstance)

___

### IBraintreeClientCreateCallback

Ƭ **IBraintreeClientCreateCallback**: (`error`: `string` \| `Error` \| `undefined`, `instance`: [`IBraintreeClientInstance`](modules.md#ibraintreeclientinstance)) => `void`

#### Type declaration

▸ (`error`, `instance`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `string` \| `Error` \| `undefined` |
| `instance` | [`IBraintreeClientInstance`](modules.md#ibraintreeclientinstance) |

##### Returns

`void`

___

### IBraintreeClientInstance

Ƭ **IBraintreeClientInstance**: `Record`<`string`, `unknown`\>

___

### IBraintreeGooglePayCreate

Ƭ **IBraintreeGooglePayCreate**: (`request`: [`IBraintreeGooglePayCreateRequest`](interfaces/IBraintreeGooglePayCreateRequest.md), `callback?`: [`IBraintreeGooglePayCreateCallback`](modules.md#ibraintreegooglepaycreatecallback)) => [`IBraintreeGooglePayInstance`](interfaces/IBraintreeGooglePayInstance.md)

#### Type declaration

▸ (`request`, `callback?`): [`IBraintreeGooglePayInstance`](interfaces/IBraintreeGooglePayInstance.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`IBraintreeGooglePayCreateRequest`](interfaces/IBraintreeGooglePayCreateRequest.md) |
| `callback?` | [`IBraintreeGooglePayCreateCallback`](modules.md#ibraintreegooglepaycreatecallback) |

##### Returns

[`IBraintreeGooglePayInstance`](interfaces/IBraintreeGooglePayInstance.md)

___

### IBraintreeGooglePayCreateCallback

Ƭ **IBraintreeGooglePayCreateCallback**: (`error`: `string` \| `Error` \| `undefined`, `instance`: [`IBraintreeGooglePayInstance`](interfaces/IBraintreeGooglePayInstance.md)) => `void`

#### Type declaration

▸ (`error`, `instance`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `string` \| `Error` \| `undefined` |
| `instance` | [`IBraintreeGooglePayInstance`](interfaces/IBraintreeGooglePayInstance.md) |

##### Returns

`void`

___

### IBraintreeRequiredContactField

Ƭ **IBraintreeRequiredContactField**: (``"postalAddress"`` \| ``"email"`` \| ``"phone"``)[]

___

### IOnAction

Ƭ **IOnAction**: (`actionType`: `string`, `payload?`: `Record`<`string`, `unknown`\>) => `void`

#### Type declaration

▸ (`actionType`, `payload?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `actionType` | `string` |
| `payload?` | `Record`<`string`, `unknown`\> |

##### Returns

`void`

## Variables

### API\_RETRY

• `Const` **API\_RETRY**: ``1``
