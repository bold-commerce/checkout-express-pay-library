# Class: GooglePayLoadingError

## Hierarchy

- `Error`

  ↳ **`GooglePayLoadingError`**

## Table of contents

### Constructors

- [constructor](GooglePayLoadingError.md#constructor)

### Properties

- [message](GooglePayLoadingError.md#message)
- [name](GooglePayLoadingError.md#name)
- [stack](GooglePayLoadingError.md#stack)
- [prepareStackTrace](GooglePayLoadingError.md#preparestacktrace)
- [stackTraceLimit](GooglePayLoadingError.md#stacktracelimit)

### Methods

- [captureStackTrace](GooglePayLoadingError.md#capturestacktrace)

## Constructors

### constructor

• **new GooglePayLoadingError**(`message`)

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
