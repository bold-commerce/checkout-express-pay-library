# Class: BraintreeNullStateKeyError

## Hierarchy

- `Error`

  ↳ **`BraintreeNullStateKeyError`**

## Table of contents

### Constructors

- [constructor](BraintreeNullStateKeyError.md#constructor)

### Properties

- [message](BraintreeNullStateKeyError.md#message)
- [name](BraintreeNullStateKeyError.md#name)
- [stack](BraintreeNullStateKeyError.md#stack)
- [prepareStackTrace](BraintreeNullStateKeyError.md#preparestacktrace)
- [stackTraceLimit](BraintreeNullStateKeyError.md#stacktracelimit)

### Methods

- [captureStackTrace](BraintreeNullStateKeyError.md#capturestacktrace)

## Constructors

### constructor

• **new BraintreeNullStateKeyError**(`message`)

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
