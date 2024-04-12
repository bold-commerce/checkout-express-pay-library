import Fastlane from 'src/fastlane/fastlane';

describe('testing Fastlane class', () => {
    const fastlaneInstanceMock = {
        setLocale: jest.fn(),
        FastlaneCardComponent: jest.fn(),
        FastlanePaymentComponent: jest.fn(),
        identity: {
            lookupCustomerByEmail: jest.fn(),
            triggerAuthenticationFlow: jest.fn(),
        },
        profile: {
            showCardSelector: jest.fn(),
            showShippingAddressSelector: jest.fn(),
        },
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        {
            type: 'ppcp',
            respAddress: {
                companyName: 'company',
                name: {
                    firstName: 'firstName',
                    lastName: 'lastName',
                    fullName: 'fullName',
                },
                address: {
                    addressLine1: 'addressLine1',
                    addressLine2: 'addressLine2',
                    adminArea2: 'adminArea2',
                    adminArea1: 'adminArea1',
                    postalCode: 'postalCode',
                    countryCode: 'countryCode',
                },
                phoneNumber: {
                    countryCode: '1',
                    nationalNumber: '2041234567',
                },
            },
            expected: () => ({
                firstName: 'firstName',
                lastName: 'lastName',
                locality: 'adminArea2',
                region: 'adminArea1',
                countryCodeAlpha2: 'countryCode',
                phoneNumber: '12041234567',
                postalCode: 'postalCode',
                streetAddress: 'addressLine1',
                extendedAddress: 'addressLine2',
                company: 'company',
            }),
        } as const,
        {
            type: 'braintree',
            respAddress: {
                firstName: 'firstName',
                lastName: 'lastName',
                locality: 'adminArea2',
                region: 'adminArea1',
                countryCodeAlpha2: 'countryCode',
                phoneNumber: '12041234567',
                postalCode: 'postalCode',
                streetAddress: 'addressLine1',
                extendedAddress: 'addressLine2',
                company: 'company',
            },
            expected() {
                return this.respAddress;
            },
        } as const,
    ])('$type showShippingAddressSelector', async (input) => {
        // Arranging
        fastlaneInstanceMock.profile.showShippingAddressSelector.mockResolvedValue({
            selectionChanged: true,
            selectedAddress: input.respAddress,
        });

        // Acting
        const fastlane = new Fastlane(fastlaneInstanceMock, input.type, '');
        const actualResp = await fastlane.profile.showShippingAddressSelector();

        // Asserting
        expect(actualResp.selectedAddress).toStrictEqual(input.expected());
    });

    test.each([
        {
            type: 'ppcp',
            respProfileData: {
                card: {},
                name: {
                    firstName: 'firstName',
                    lastName: 'firstName',
                },
                shippingAddress: {
                    companyName: 'company',
                    name: {
                        firstName: 'firstName',
                        lastName: 'lastName',
                        fullName: 'fullName',
                    },
                    address: {
                        addressLine1: 'addressLine1',
                        addressLine2: 'addressLine2',
                        adminArea2: 'adminArea2',
                        adminArea1: 'adminArea1',
                        postalCode: 'postalCode',
                        countryCode: 'countryCode',
                    },
                    phoneNumber: {
                        countryCode: '1',
                        nationalNumber: '2041234567',
                    },
                }
            },
            expected: () => ({
                firstName: 'firstName',
                lastName: 'lastName',
                locality: 'adminArea2',
                region: 'adminArea1',
                countryCodeAlpha2: 'countryCode',
                phoneNumber: '12041234567',
                postalCode: 'postalCode',
                streetAddress: 'addressLine1',
                extendedAddress: 'addressLine2',
                company: 'company',
            }),
        } as const,
        {
            type: 'braintree',
            respProfileData: {
                card: {},
                name: {
                    firstName: 'firstName',
                    lastName: 'firstName',
                },
                shippingAddress: {
                    firstName: 'firstName',
                    lastName: 'lastName',
                    locality: 'adminArea2',
                    region: 'adminArea1',
                    countryCodeAlpha2: 'countryCode',
                    phoneNumber: '12041234567',
                    postalCode: 'postalCode',
                    streetAddress: 'addressLine1',
                    extendedAddress: 'addressLine2',
                    company: 'company',
                },
            },
            expected() {
                return this.respProfileData.shippingAddress;
            },
        } as const,
    ])('$type triggerAuthenticationFlow', async (input) => {
        // Arranging
        fastlaneInstanceMock.identity.triggerAuthenticationFlow.mockResolvedValue({
            authenticationState: 'succeeded',
            profileData: input.respProfileData,
        });

        // Acting
        const fastlane = new Fastlane(fastlaneInstanceMock, input.type, '');
        const actualResp = await fastlane.identity.triggerAuthenticationFlow('1');

        // Asserting
        expect(actualResp.profileData.shippingAddress).toStrictEqual(input.expected());
    });
});