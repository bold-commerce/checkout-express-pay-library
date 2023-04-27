# Interface: IPaypalNamespaceApple

## Hierarchy

- `PayPalNamespace`

  ↳ **`IPaypalNamespaceApple`**

## Table of contents

### Properties

- [FUNDING](IPaypalNamespaceApple.md#funding)
- [HostedFields](IPaypalNamespaceApple.md#hostedfields)
- [getFundingSources](IPaypalNamespaceApple.md#getfundingsources)
- [isFundingEligible](IPaypalNamespaceApple.md#isfundingeligible)
- [rememberFunding](IPaypalNamespaceApple.md#rememberfunding)
- [version](IPaypalNamespaceApple.md#version)

### Methods

- [Applepay](IPaypalNamespaceApple.md#applepay)
- [Buttons](IPaypalNamespaceApple.md#buttons)
- [Marks](IPaypalNamespaceApple.md#marks)
- [Messages](IPaypalNamespaceApple.md#messages)

## Properties

### FUNDING

• `Optional` **FUNDING**: `Record`<`string`, `FUNDING_SOURCE`\>

#### Inherited from

PayPalNamespace.FUNDING

___

### HostedFields

• `Optional` **HostedFields**: `PayPalHostedFieldsComponent`

#### Inherited from

PayPalNamespace.HostedFields

___

### getFundingSources

• `Optional` **getFundingSources**: `getFundingSources`

#### Inherited from

PayPalNamespace.getFundingSources

___

### isFundingEligible

• `Optional` **isFundingEligible**: `isFundingEligible`

#### Inherited from

PayPalNamespace.isFundingEligible

___

### rememberFunding

• `Optional` **rememberFunding**: `rememberFunding`

#### Inherited from

PayPalNamespace.rememberFunding

___

### version

• **version**: `string`

#### Inherited from

PayPalNamespace.version

## Methods

### Applepay

▸ **Applepay**(): [`IPPCPApplePayInstance`](IPPCPApplePayInstance.md)

#### Returns

[`IPPCPApplePayInstance`](IPPCPApplePayInstance.md)

___

### Buttons

▸ `Optional` **Buttons**(`options?`): `PayPalButtonsComponent`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `PayPalButtonsComponentOptions` |

#### Returns

`PayPalButtonsComponent`

#### Inherited from

PayPalNamespace.Buttons

___

### Marks

▸ `Optional` **Marks**(`options?`): `PayPalMarksComponent`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `PayPalMarksComponentOptions` |

#### Returns

`PayPalMarksComponent`

#### Inherited from

PayPalNamespace.Marks

___

### Messages

▸ `Optional` **Messages**(`options?`): `PayPalMessagesComponent`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `PayPalMessagesComponentOptions` |

#### Returns

`PayPalMessagesComponent`

#### Inherited from

PayPalNamespace.Messages
