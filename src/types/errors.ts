export class ApplePayLoadingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = ApplePayLoadingError.name;
        Object.setPrototypeOf(this, ApplePayLoadingError.prototype);
    }
}

export class GooglePayLoadingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = GooglePayLoadingError.name;
        Object.setPrototypeOf(this, GooglePayLoadingError.prototype);
    }
}

export class FastlaneLoadingError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ApplePayValidateMerchantError extends Error {
    constructor(message: string) {
        super(message);
        this.name = ApplePayValidateMerchantError.name;
        Object.setPrototypeOf(this, ApplePayValidateMerchantError.prototype);
    }
}

export class BraintreeNullStateKeyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = BraintreeNullStateKeyError.name;
        Object.setPrototypeOf(this, BraintreeNullStateKeyError.prototype);
    }
}

export class PaypalNullStateKeyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = PaypalNullStateKeyError.name;
        Object.setPrototypeOf(this, PaypalNullStateKeyError.prototype);
    }
}