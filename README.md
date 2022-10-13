# Checkout Express Pay Library

## Description
The Checkout Express Pay Library is a Bold Javascript library, which contains reusable methods to implement the wallet payment using Bold's [Headless Checkout APIs.](https://developer.boldcommerce.com/default/guides/checkout)

Currently, the library supports the following payment gateways:

* Stripe (Google & Apple Pay)
* PayPal

## Installation

### Prerequisites

#### Install and initialize the Checkout Frontend Library

The Checkout Frontend Library is a peer dependency for the Checkout Express Pay Library, which means that both packages needs to be used together.

Before initializing the Checkout Express Pay Library, you must initialize the Checkout Frontend Library by using the `initialize` method.

The TypeScript code snippet below shows an example of initializing the Checkout Frontend Library:

```typescript
import {IApiReturnObject, initialize} from '@bold-commerce/checkout-frontend-library';

const response:IApiReturnObject = await initialize(data, shopIdentifier, environment);
```
#### Create placeholder div
Create a placeholder `<div>` within your application with an id of `express-payment-container`. This div holds all the wallet pay dom elements.

#### Configure wallet payment gateway

You must configure the wallet payment gateway in the Bold Checkout admin.

### Install with Yarn
```
yarn add "@bold-commerce/checkout-express-pay-library"
```

#### Install a specific version

```
yarn add "@bold-commerce/checkout-express-pay-library"@1.0.0
```
_(replace "1.0.0" with the version number that you want)_

### Install with NPM
```
npm install "@bold-commerce/checkout-express-pay-library"
```

#### Install a specific version

```
npm install "@bold-commerce/checkout-express-pay-library"@1.0.0
```
_(replace "1.0.0" with the version number that you want)_

## Usage

### Initializing Express Pay library

The `initialize` function expects an `onAction` callback. This callback is used whenever the library needs to communicate with the rest of your application. It does this by passing the callback actions, which consist of a `type` and an optional `payload`. For a full list of all of the actions the library will emit, see the [actions](#actions) section below.

The library also exports a style sheet with some default styling for express payment section. The application can import this default css file for styling.

#### Parameters

| Parameter| type| Description|
| ---------| ----|-----------|
| `props`| [IInitializeProps]()| The prop to initialize the express payment library. |

#### Example

```
@import '~@bold-commerce/checkout-express-pay-library/lib/style.css';
```

```typescript
import {initialize, actionTypes} from '@bold-commerce/checkout-express-pay-library';

const handleExpressPayActions = async (type, payload) => {
    switch (type) {
        case actionTypes.ENABLE_DISABLE_SECTION:
            // Implement the frontend behavior of your application.
        default:
            break;
        }
    };
initialize({onAction: handleExpressPayActions});
```

### Actions

The frontend application must define the following actions in order to implement their own desired frontend experience.

#### Enable Disable Section

* `string` type: `ENABLE_DISABLE_SECTION`
* `object`payload:
  * `boolean` show - true if there is any valid wallet pay gateway

This action defines whether the frontend needs to show the express pay section or not. By default, this section is hidden.

#### Order Processing

* `string` type: `ORDER_PROCESSING`

This action indicates that the payment was successfully added to the order but order was not processed by the Checkout Express Pay Library. In this action, the frontend needs to call [Process Order](https://developer.boldcommerce.com/default/api/checkout#tag/Order/operation/post-process_order) endpoint separately to complete the order.

#### Display Error

* `string` type: `DISPLAY_ERROR`
* `object`payload:
  * `string` message - The error message
  * `object` details - The details about `language_blob` for translation. Retrieve the `language_blob` from the [Initialize Order](https://developer.boldcommerce.com/default/api/orders#tag/Orders/operation/post-init) endpoint.
    * `string` section: The section in the `language_blob` 
    * `string` term: The term in the `language_blob`

This action sends error details to your frontend application in case of any failure. 

### Payment Gateways

The library creates specific dom element for each payment gateway inside `express-payment-container` div container. The below information can be used to apply custom styling if needed.

| Payment Gateway| Description |
| ---------| -----------|
| `Stripe`|  The Stripe container will create a div with `stripe-express-payment` id and `stripe-express-payment express-payment` classnames. |
| `PayPal`|  The Paypal container will create a div with `paypal-express-payment` id and `paypal-express-payment express-payment` classnames. |

