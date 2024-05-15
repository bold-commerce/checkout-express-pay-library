interface IFastlaneAddress {
  firstName: string;
  lastName: string;
  company?: string;
  streetAddress: string;
  extendedAddress?: string;
  locality: string; // City
  region: string; // State
  postalCode: string;
  countryCodeNumeric?: number;
  countryCodeAlpha2: string;
  countryCodeAlpha3?: string;
  phoneNumber: string;
}

export interface IFastlanePaymentToken {
    id: string;
    paymentSource: {
        card: {
            brand: string;
            expiry: string; // "YYYY-MM"
            lastDigits: string; // "1111"
            name: string;
            billingAddress: IFastlaneAddress;
        }
    }
}

export interface IFastlanePaymentComponent {
    render: (container: string) => IFastlanePaymentComponent;
    getPaymentToken: () => Promise<IFastlanePaymentToken>;
    setShippingAddress: (shippingAddress: IFastlaneAddress) => void;
}

export interface IFastlaneCardComponent {
    render: (container: string) => IFastlaneCardComponent;
    getPaymentToken: (options: {
        billingAddress: IFastlaneAddress;
    }) => Promise<IFastlanePaymentToken>;
}

export interface IFastlaneWatermarkComponent {
    render: (container: string) => null;
}

interface Field {
    placeholder?: string;
    prefill?: string;
}

export interface IFastlaneComponentOptions {
    styles?: unknown;  
    fields?: {
        number?: Field;
        expirationDate?: Field;
        expirationMonth?: Field;
        expirationYear?: Field
        cvv?: Field;
        postalCode?: Field;
        cardholderName?: Field;
        phoneNumber?: Field;
    };
    shippingAddress?: IFastlaneAddress;
}

export interface IFastlaneWatermarkOptions {
    includeAdditionalInfo: boolean;
}

export interface IFastlaneAuthenticatedCustomerResult {
    authenticationState: 'succeeded'|'failed'|'canceled'|'not_found';
    profileData: {
        name: {
            firstName: string;
            lastName: string;
        };
        shippingAddress: IFastlaneAddress | undefined;
        card: IFastlanePaymentToken;
      }
}

export interface IFastlaneInstance {
    gatewayPublicId: string;
    type: 'ppcp' | 'braintree';
    profile: {
        showShippingAddressSelector: () => Promise<{
            selectionChanged: true;
            selectedAddress: IFastlaneAddress;
        } | {
            selectionChanged: false;
            selectedAddress: null;
        }>;
        showCardSelector: () => Promise<{
            selectionChanged: true;
            selectedCard: IFastlanePaymentToken;
        } | {
            selectionChanged: false;
            selectedCard: null;
        }>;
    };
    setLocale: (locale: string) => void;
    identity: {
        lookupCustomerByEmail: (email: string) => Promise<{customerContextId: string}>;
        triggerAuthenticationFlow: (customerContextId: string) => Promise<IFastlaneAuthenticatedCustomerResult>
    };
    FastlanePaymentComponent: (options: IFastlaneComponentOptions) => Promise<IFastlanePaymentComponent>;
    FastlaneCardComponent: (options: Omit<IFastlaneComponentOptions, 'shippingAddress'>) => IFastlaneCardComponent;
    FastlaneWatermarkComponent: (options: IFastlaneWatermarkOptions) => IFastlaneWatermarkComponent;
}

export interface IFastlaneOptions {
    shippingAddressOptions: IFastlaneAddressOptions,
    cardOptions: IFastlaneCardOptions,
    styles: IFastlaneStyleOptions
}

export interface IFastlaneAddressOptions {
    // default: empty array = all locations allowed
    allowedLocations: string[];
}

export interface IFastlaneCardOptions {
    // default: empty array = all brands allowed
    allowedBrands: IFastlaneCardBrandTypes[];
}
  
export type IFastlaneCardBrandTypes =
    'VISA' |
    'MASTERCARD' |
    'AMERICAN-EXPRESS' |
    'DINERS-CLUB' |
    'DISCOVER' |
    'JCB' |
    'UNION-PAY' |
    'MAESTRO' |
    'ELO' |
    'MIR' |
    'HIPER' |
    'HIPERCARD';


export interface IFastlaneStyleOptions {
    root: {
        backgroundColor: string 
        errorColor: string, 
        fontFamily: string, 
        textColorBase: string,
        fontSizeBase: string, 
        padding: string, 
        primaryColor: string 
    },
    input: {
        backgroundColor: string, 
        borderRadius: string, 
        borderColor: string, 
        borderWidth: string, 
        textColorBase: string, 
        focusBorderColor: string, 
    }
}