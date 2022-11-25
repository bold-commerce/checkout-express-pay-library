# Class: ApplePayValidateMerchantError

## Hierarchy

- `Error`

  ↳ **`ApplePayValidateMerchantError`**

## Table of contents

### Constructors

- [constructor](ApplePayValidateMerchantError.md#constructor)

### Properties

- [message](ApplePayValidateMerchantError.md#message)
- [name](ApplePayValidateMerchantError.md#name)
- [stack](ApplePayValidateMerchantError.md#stack)
- [prepareStackTrace](ApplePayValidateMerchantError.md#preparestacktrace)
- [stackTraceLimit](ApplePayValidateMerchantError.md#stacktracelimit)

### Methods

- [captureStackTrace](ApplePayValidateMerchantError.md#capturestacktrace)

## Constructors

### constructor

• **new ApplePayValidateMerchantError**(`message`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Overrides

Error.constructor

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

___

### name

• **name**: `string`

#### Inherited from

Error.name

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace
