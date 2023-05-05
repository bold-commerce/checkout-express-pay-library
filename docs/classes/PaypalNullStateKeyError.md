# Class: PaypalNullStateKeyError

## Hierarchy

- `Error`

  ↳ **`PaypalNullStateKeyError`**

## Table of contents

### Constructors

- [constructor](PaypalNullStateKeyError.md#constructor)

### Properties

- [message](PaypalNullStateKeyError.md#message)
- [name](PaypalNullStateKeyError.md#name)
- [stack](PaypalNullStateKeyError.md#stack)
- [prepareStackTrace](PaypalNullStateKeyError.md#preparestacktrace)
- [stackTraceLimit](PaypalNullStateKeyError.md#stacktracelimit)

### Methods

- [captureStackTrace](PaypalNullStateKeyError.md#capturestacktrace)

## Constructors

### constructor

• **new PaypalNullStateKeyError**(`message`)

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
