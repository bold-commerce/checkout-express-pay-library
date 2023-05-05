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

▸ **confirmOrder**(`confirmOrderParam`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `confirmOrderParam` | [`IPPCPApplePayInstanceConfirmOrderParam`](IPPCPApplePayInstanceConfirmOrderParam.md) |

#### Returns

`Promise`<`unknown`\>

___

### validateMerchant

▸ **validateMerchant**(`validateMerchantParam`): `Promise`<[`IPPCPApplePayValidateMerchantResponse`](IPPCPApplePayValidateMerchantResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `validateMerchantParam` | [`IPPCPApplePayInstanceValidateMerchantParam`](IPPCPApplePayInstanceValidateMerchantParam.md) |

#### Returns

`Promise`<[`IPPCPApplePayValidateMerchantResponse`](IPPCPApplePayValidateMerchantResponse.md)\>
