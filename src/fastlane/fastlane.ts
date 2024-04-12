import {IFastlaneInstance} from 'src/types';

// Do not remove. This is here to enforce adherence of this class to the interface
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _: IFastlaneInstance = {} as Fastlane;
type OmittedIFastlaneInstance = Omit<IFastlaneInstance, 'gatewayPublicId' | 'type'>;
type IFastlaneAddress = Awaited<ReturnType<IFastlaneInstance['identity']['triggerAuthenticationFlow']>>['profileData']['shippingAddress'];

interface IPayPalAddress {
    companyName?: string;
    name: {
        firstName: 'string';
        lastName: 'string';
        fullName: 'string';
    };
    address: {
        addressLine1: 'string';
        addressLine2?: 'string';
        adminArea2: 'string';
        adminArea1: 'string';
        postalCode: 'string',
        countryCode: 'string';
    };
    phoneNumber: {
        nationalNumber: 'string';
        countryCode: 'string';
    };
}

export default class Fastlane {
    public profile: IFastlaneInstance['profile'];
    public identity: IFastlaneInstance['identity'];
    public FastlaneCardComponent: IFastlaneInstance['FastlaneCardComponent'];
    public FastlanePaymentComponent: IFastlaneInstance['FastlanePaymentComponent'];
    setLocale: IFastlaneInstance['setLocale']; 

    constructor(
        private instance: OmittedIFastlaneInstance,
        public type: IFastlaneInstance['type'],
        public gatewayPublicId: string
    ) {
        this.setLocale = instance.setLocale.bind(instance);
        this.identity = {
            triggerAuthenticationFlow: this.triggerAuthenticationFlow,
            lookupCustomerByEmail: instance.identity.lookupCustomerByEmail.bind(instance.identity),
        };
        this.profile = {
            showShippingAddressSelector: this.showShippingAddressSelector,
            showCardSelector: instance.profile.showCardSelector.bind(instance.profile.showCardSelector),
        };
        this.FastlaneCardComponent = instance.FastlaneCardComponent.bind(instance);
        this.FastlanePaymentComponent = instance.FastlanePaymentComponent.bind(instance);
    }

    private showShippingAddressSelector = async () => {
        const resp = await this.instance.profile.showShippingAddressSelector();

        // No restructuring needed for PPCP unless the selection has not changed
        if (this.type === 'braintree' || !resp.selectionChanged) {
            return resp;
        }
        
        const paypalAddress = resp.selectedAddress as unknown as IPayPalAddress;
        return {
            selectionChanged: resp.selectionChanged,
            selectedAddress: this.transformPaypalAddress(paypalAddress),
        };
    }

    private triggerAuthenticationFlow = async (customerContextId: string) => {
        const resp = await this.instance.identity.triggerAuthenticationFlow(customerContextId);

        if (this.type === 'braintree' || resp.authenticationState !== 'succeeded') {
            return resp;
        }

        const paypalAddress = resp.profileData.shippingAddress as unknown as IPayPalAddress;
        return {
            authenticationState: resp.authenticationState,
            profileData: {
                card: resp.profileData.card,
                name: resp.profileData.name,
                shippingAddress: this.transformPaypalAddress(paypalAddress),
            },
        };
    }

    private transformPaypalAddress = (paypalAddress: IPayPalAddress) => {
        return {
            firstName: paypalAddress.name.firstName,
            lastName: paypalAddress.name.lastName,
            locality: paypalAddress.address.adminArea2,
            region: paypalAddress.address.adminArea1,
            countryCodeAlpha2: paypalAddress.address.countryCode,
            phoneNumber: `${paypalAddress.phoneNumber.countryCode}${paypalAddress.phoneNumber.nationalNumber}`,
            postalCode: paypalAddress.address.postalCode,
            streetAddress: paypalAddress.address.addressLine1,
            extendedAddress: paypalAddress.address.addressLine2,
            company: paypalAddress.companyName,
        };
    }
}
