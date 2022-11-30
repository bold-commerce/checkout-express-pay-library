# Interface: IStripePaymentEvent

## Table of contents

### Properties

- [payerEmail](IStripePaymentEvent.md#payeremail)
- [payerName](IStripePaymentEvent.md#payername)
- [payerPhone](IStripePaymentEvent.md#payerphone)
- [shippingAddress](IStripePaymentEvent.md#shippingaddress)
- [shippingOption](IStripePaymentEvent.md#shippingoption)
- [token](IStripePaymentEvent.md#token)
- [walletName](IStripePaymentEvent.md#walletname)

### Methods

- [complete](IStripePaymentEvent.md#complete)
- [updateWith](IStripePaymentEvent.md#updatewith)

## Properties

### payerEmail

• `Optional` **payerEmail**: `string`

___

### payerName

• `Optional` **payerName**: `string`

___

### payerPhone

• `Optional` **payerPhone**: `string`

___

### shippingAddress

• `Optional` **shippingAddress**: [`IStripeAddress`](IStripeAddress.md)

___

### shippingOption

• `Optional` **shippingOption**: [`IStripeShippingOptions`](IStripeShippingOptions.md)

___

### token

• `Optional` **token**: [`IStripeToken`](IStripeToken.md)

___

### walletName

• `Optional` **walletName**: `string`

## Methods

### complete

▸ `Optional` **complete**(`status`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `string` |

#### Returns

`void`

___

### updateWith

▸ **updateWith**(`params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`IStripeUpdateWithParam`](IStripeUpdateWithParam.md) |

#### Returns

`void`
