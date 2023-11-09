# Checkout Express Pay Library

## Description
The Checkout Express Pay Library is a Bold Javascript library, which contains reusable methods to implement the wallet payment using Bold's [Headless Checkout APIs.](https://developer.boldcommerce.com/default/guides/checkout)

This library adds a series of wallet pay buttons in your application container.

User interaction with the buttons and the payment dialogs will update the order that was initialized from [Initialize Order](https://developer.boldcommerce.com/default/api/orders#tag/Orders) endpoint and provided during the checkout initialization.

The library sends responses to a callback function in order to communicate the actions taken by the user throughout the checkout experience. For more information on how to define this callback function, refer to [Initializing Express Pay Library](#initializing-express-pay-library).

Currently, the library supports the following payment gateways:

* Stripe (Google & Apple Pay)
* Braintree (Google & Apple Pay)
* PayPal

> Bold provides a template checkout experience that utilizes this Express Pay Library. The examples throughout this document link to various places in the following repository: [Checkout Experience Templates](https://github.com/bold-commerce/checkout-experience-templates)

## Installation

### Prerequisites

To correctly implement the Checkout Express Pay library, complete the following steps:


#### ▸ Install Checkout Frontend Library

The [Checkout Frontend Library](https://github.com/bold-commerce/checkout-frontend-library) is a peer dependency for the Checkout Express Pay Library, which means that both packages **NEED** to be used together.

Checkout Express Pay library uses the methods from the Checkout Frontend Library to call to the [Bold Checkout APIs](https://developer.boldcommerce.com/default/guides/checkout).

Checkout Frontend Library is NOT yet published in the NPM Registry.

To install is this library, follow the instructions in the Checkout Frontend  Repository readme, linked below. You must link this library as a package in your application.

> [Checkout Frontend Library Repository](https://github.com/bold-commerce/checkout-frontend-library) - Package name @boldcommerce/checkout-frontend-library
> 
> [NPM LINK OPTION: documentation](https://docs.npmjs.com/cli/v8/commands/npm-link)
> 
> [YARN LINK OPTION: documentation](https://classic.yarnpkg.com/lang/en/docs/cli/link/)

#### ▸ Install Checkout Express Pay Library

After Checkout Frontend Library is installed, you can then install the Checkout Express Pay Library. You must link this library as a package in the project you would like to include it in.

Checkout Express Pay Library is NOT yet published in the NPM Registry.

> [NPM LINK OPTION: documentation](https://docs.npmjs.com/cli/v8/commands/npm-link)
>
> [YARN LINK OPTION: documentation](https://classic.yarnpkg.com/lang/en/docs/cli/link/)

#### ▸ Initialize Checkout Frontend Library

Before initializing the Checkout Express Pay Library, you **MUST** initialize the Checkout Frontend Library in your application by using the `initialize` method.

**initialize**(`initData`, `shopIdentifier`, `environment`): Promise <[IApiReturnObject](https://github.com/bold-commerce/checkout-frontend-library/blob/main/docs/interfaces/IApiReturnObject.md) >

Initialize the library with order data and environment variables. The library needs to be initialized with required data before using any other functionality. The following TypeScript snippet shows an example of how to initialize this library.

```typescript
import {IApiReturnObject, initialize} from '@boldcommerce/checkout-frontend-library';

 const environment = {type: 'production'};
 const response: IApiReturnObject = await initialize(initData, shopIdentifier, environment);
```

> In Template Example: [Checkout Experience Templates - session.ts](https://github.com/bold-commerce/checkout-experience-templates/blob/5703757ccef3cc1832be0adaed9983dd40dd3ccc/src/library/session.ts#L9) 

**Parameters**

| Parameter| Type| Description|
| ---------| ----|-----------|
| `initData`| [IInitializeOrderResponse](https://github.com/bold-commerce/checkout-frontend-library/blob/main/docs/interfaces/IInitializeOrderResponse.md) | The order data obtain from [Initialize Order](https://developer.boldcommerce.com/default/api/orders#tag/Orders) endpoint.  |
| `shopIdentifier`| `string` | The identifier of the shop. Can be retrieved by making a request to the [Get Info](https://developer.boldcommerce.com/default/api/shops#tag/Shop) endpoint.|
| `environment`| [IEnvironment](https://github.com/bold-commerce/checkout-frontend-library/blob/main/docs/interfaces/IEnvironment.md) | Defined the bold API environment. Use `{"type":"production"}` even for test stores, other types are for Bold internal use. |


**Returns**

`Promise`<[IApiReturnObject](https://github.com/bold-commerce/checkout-frontend-library/blob/main/docs/interfaces/IApiReturnObject.md) >

A promise that resolves the API response. 

Your application can use this response to handle errors or update the application state of the order.

> In Template Example: [Checkout Experience Templates - session.ts](https://github.com/bold-commerce/checkout-experience-templates/blob/5703757ccef3cc1832be0adaed9983dd40dd3ccc/src/library/session.ts#L13)

#### ▸ Create placeholder container div
Create a placeholder `<div>` within your application with an id of `express-payment-container`. 

This `<div>` holds all the wallet pay DOM elements. The library creates individual `<div>` elements for each button that will be rendered by the payment gateways.

More details on each payment gateway classes for styling can be found in [Payment Gateways](#payment-gateways)

The action callback function returns the [Enable Disable Section Action](#actions) when the Payment Gateways are rendering buttons in order to inform the template to show or hide this container.

See more information in [Usage](#usage) and [Actions](#actions).

> In Template Example: [Checkout Experience Templates - expressPaymentGateway.tsx](https://github.com/bold-commerce/checkout-experience-templates/blob/5703757ccef3cc1832be0adaed9983dd40dd3ccc/src/components/express-payment-gateway/expressPaymentGateway.tsx#L13)

#### ▸ Configure wallet payment gateway

Follow the official documentation of each payment gateway to create your credentials. Ensure you enable the wallet pay functionalities of the payment gateway.

With the credentials in hand, configure the wallet payment gateway in the Bold Checkout admin.

## Usage

### Initializing Express Pay library

The `initialize` function expects an `onAction` callback in the parameter properties. 

This callback is used whenever the library needs to communicate with the rest of your application. 
It does this by passing the callback actions, which consist of a `type` and an optional `payload`.

It can be triggered at any moment of the process since the library was initialized.

Each of the actions occurs at a different point in the checkout process. For example:
- `ORDER_PROCESSING` occurs when user finalizes the payment process and all validation succeeds.
- `ENABLE_DISABLE_SECTION` occurs when the payment gateway is loaded using the credentials - `true` when at least 1 payment gateway loaded successfully and `false` when none have loaded.
- `DISPLAY_ERROR` occurs when any error occurs from an API call that is not handled internally by the payment gateways.
- `RERESH_ORDER` occurs when cancelling a wallet pay and the order state should be updated with the changes from the wallet pay.

For a full list of all actions the library will emit, see the [actions](#actions) section below.

> In Template Example: [Checkout Experience Templates - initializeExpressPay.ts](https://github.com/bold-commerce/checkout-experience-templates/blob/5703757ccef3cc1832be0adaed9983dd40dd3ccc/src/library/initializeExpressPay.ts#L18)

The following TypeScript example shows how you can handle the actions.

```typescript
import {initialize, actionTypes} from '@boldcommerce/checkout-express-pay-library';

const handleExpressPayActions = async (type, payload) => {
    switch (type) {
        case actionTypes.ENABLE_DISABLE_SECTION:
            // Implement a template behavior, if any, desired for the action in each case.
            // For instance, show or hide the express pay container or section in the template.
            // Or move the the thank you page if order is processed.
        default:
            break;
        }
    };
initialize({onAction: handleExpressPayActions});
```

#### `Initialize` parameters

| Parameter| Type| Description|
| ---------| ----|-----------|
| `props`| [IInitializeProps](https://github.com/bold-commerce/checkout-express-pay-library/blob/main/docs/interfaces/IInitializeProps.md)| The prop to initialize the express payment library. Your application can provide onAction functionality in object {onAction} |


### Import Express Pay library Style

The library also exports a style sheet with some default styling for the express payment section of the checkout. Your application can import this default css file for styling using the following statement:

```
@import '~@boldcommerce/checkout-express-pay-library/lib/style.css';
```

> In Template Example: [Checkout Experience Templates - app.css](https://github.com/bold-commerce/checkout-experience-templates/blob/5703757ccef3cc1832be0adaed9983dd40dd3ccc/public/app.css#L54)

## Rendering payment button

The express pay buttons will render in the checkout after the following steps occur:

1. Checkout Frontend Library is initialized.
1. Container `<div>` is present in the DOM.
1. Payment gateway credentials are valid.
1. Express Pay Library is initialized.
1. Payment gateway considers the session ready to pay.


## Actions

Because each unique checkout experience can have different implementations, the library uses actions to inform the application what happens in the checkout experience so that the application can decide what to do next.

Whenever the library needs to communicate with the rest of the application, it does so through the action callback function provided during the library initialization.

The callback will be called with `type` and an optional `payload` and can be triggered at any moment on the process since the library was initialized.

> In Template Example: [Checkout Experience Templates - initializeExpressPay.ts](https://github.com/bold-commerce/checkout-experience-templates/blob/5703757ccef3cc1832be0adaed9983dd40dd3ccc/src/library/initializeExpressPay.ts#L18)

Your application can define the following actions in order to implement a complete checkout experience.

#### Enable Disable Section

This action will happen when the payment gateway is loaded using the credentials.

* `string` type: `ENABLE_DISABLE_SECTION`
* `object`payload:
  * `boolean` show - `true` means at least 1 payment gateway loaded successfully and `false` means none have loaded

This action can be used to define whether the template needs to show the express pay section or not.

#### Order Processing

This action occurs when the user finalizes the payment process and all validations succeed.

* `string` type: `ORDER_PROCESSING`

This action indicates that the payment was successfully added to the order but order was not processed by the Checkout Express Pay Library. 

In response to this action, the application must call [Process Order](https://developer.boldcommerce.com/default/api/checkout#tag/Order/operation/post-process_order) endpoint separately to complete the order.

#### Display Error

This action occurs when any error occurs in response to an API call that is not handled internally by the payment gateways.

* `string` type: `DISPLAY_ERROR`
* `object`payload:
  * `string` message - The error message
  * `object` details - The details about `language_blob` for translation. Retrieve the `language_blob` from the [Initialize Order](https://developer.boldcommerce.com/default/api/orders#tag/Orders/operation/post-init) endpoint.
    * `string` section: The section in the `language_blob` 
    * `string` term: The term in the `language_blob`

This action sends error details to your application in case of any failure so the application can choose to show an error message in some manner.

## Payment Gateways

The library creates specific DOM element for each payment gateway inside the `express-payment-container` `<div>` container. The below information can be used to apply custom styling if needed.

| Payment Gateway| Description |
| ---------| -----------|
| `Stripe`|  The Stripe container will create a div with `stripe-express-payment` id and `stripe-express-payment express-payment` classnames. |
| `Braintree Google`|  The Braintree Google container will create a div with `braintree-google-express-payment` id and `braintree-google-express-payment express-payment` classnames. |
| `Braintree Apple`|  The Braintree Apple container will create a div with `braintree-apple-express-payment` id and `braintree-apple-express-payment express-payment` classnames. |
| `PayPal`|  The Paypal container will create a div with `paypal-express-payment` id and `paypal-express-payment express-payment` classnames. |
