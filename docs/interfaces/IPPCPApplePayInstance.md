# Interface: IPPCPApplePayInstance

## Table of contents

### Methods

- [config](IPPCPApplePayInstance.md#config)
- [confirmOrder](IPPCPApplePayInstance.md#confirmorder)
- [validateMerchant](IPPCPApplePayInstance.md#validatemerchant)

## Methods

### config

▸ **config**(): `Promise`<[`IPPCPAppleConfig`](IPPCPAppleConfig.md)\>

#### Returns

`Promise`<[`IPPCPAppleConfig`](IPPCPAppleConfig.md)\>

___

### confirmOrder

▸ **confirmOrder**(`orderId`, `token`, `billingContact?`, `shippingContact?`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderId` | `string` |
| `token` | `ApplePayPaymentToken` |
| `billingContact?` | `ApplePayPaymentContact` |
| `shippingContact?` | `ApplePayPaymentContact` |

#### Returns

`Promise`<`unknown`\>

___

### validateMerchant

▸ **validateMerchant**(`validationUrl`, `displayName?`): `Promise`<[`IPPCPApplePayValidateMerchantResponse`](IPPCPApplePayValidateMerchantResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `validationUrl` | `string` |
| `displayName?` | `string` |

#### Returns

`Promise`<[`IPPCPApplePayValidateMerchantResponse`](IPPCPApplePayValidateMerchantResponse.md)\>
