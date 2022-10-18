# @bold-commerce/checkout-express-pay-library

## Table of contents

### Interfaces

- [IActionTypes](interfaces/IActionTypes.md)
- [IBraintreeConstants](interfaces/IBraintreeConstants.md)
- [IBraintreeState](interfaces/IBraintreeState.md)
- [IBraintreeUrls](interfaces/IBraintreeUrls.md)
- [IExpressPayContext](interfaces/IExpressPayContext.md)
- [IGetFirstAndLastName](interfaces/IGetFirstAndLastName.md)
- [IInitializeProps](interfaces/IInitializeProps.md)
- [IPaypalConstants](interfaces/IPaypalConstants.md)
- [IPaypalPatchOperation](interfaces/IPaypalPatchOperation.md)
- [IPaypalState](interfaces/IPaypalState.md)
- [IShowPaymentMethods](interfaces/IShowPaymentMethods.md)
- [IStripeAddress](interfaces/IStripeAddress.md)
- [IStripeCard](interfaces/IStripeCard.md)
- [IStripeEvent](interfaces/IStripeEvent.md)
- [IStripePaymentEvent](interfaces/IStripePaymentEvent.md)
- [IStripePaymentItem](interfaces/IStripePaymentItem.md)
- [IStripeShippingOptions](interfaces/IStripeShippingOptions.md)
- [IStripeToken](interfaces/IStripeToken.md)
- [IStripeUpdateWithParam](interfaces/IStripeUpdateWithParam.md)

### Type Aliases

- [IOnAction](modules.md#ionaction)
- [IPaypalPatch](modules.md#ipaypalpatch)

### Variables

- [API\_RETRY](modules.md#api_retry)

## Type Aliases

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

___

### IPaypalPatch

Ƭ **IPaypalPatch**: (`operations`: [`IPaypalPatchOperation`](interfaces/IPaypalPatchOperation.md)[]) => `Promise`<`OrderResponseBody`\>

#### Type declaration

▸ (`operations`): `Promise`<`OrderResponseBody`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `operations` | [`IPaypalPatchOperation`](interfaces/IPaypalPatchOperation.md)[] |

##### Returns

`Promise`<`OrderResponseBody`\>

## Variables

### API\_RETRY

• `Const` **API\_RETRY**: ``1``
