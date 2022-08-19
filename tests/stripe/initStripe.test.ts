import {
    changeStripeShippingLines,
    checkStripeAddress,
    getStripeDisplayItem,
    initStripe,
    stripeOnload
} from 'src';
import {
    alternatePaymentMethodType,
    getApplicationState,
    getCurrency,
    getOrderInitialData,
    IApplicationState,
} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {currencyMock, orderInitialDataMock} from '@bold-commerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('src/stripe/getStripeDisplayItem');
jest.mock('src/stripe/checkStripeAddress');
jest.mock('src/stripe/changeStripeShippingLines');
const getApplicationStateMock = mocked(getApplicationState, true);
const getCurrencyMock = mocked(getCurrency, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const getStripeDisplayItemMock = mocked(getStripeDisplayItem, true);
const checkStripeAddressMock = mocked(checkStripeAddress, true);
const changeStripeShippingLinesMock = mocked(changeStripeShippingLines, true);

describe('testing init Stripe function', () => {

    const stripe = {
        type: alternatePaymentMethodType.STRIPE,
        key: '',
        stripe_user_id: '',
        public_id: '',
        account_country: 'CA'
    };

    const orderTotal = 200;
    const displayItemMock = [{label: 'test', amount: 1200}];

    beforeEach(() => {
        jest.clearAllMocks();
        getApplicationStateMock.mockReturnValue({order_total: orderTotal} as IApplicationState);
        getCurrencyMock.mockReturnValue(currencyMock);
        getOrderInitialDataMock.mockReturnValue(orderInitialDataMock);
        getStripeDisplayItemMock.mockReturnValue(displayItemMock);
    });

    test('testing initStripe', () => {
        jest.spyOn(document.head, 'appendChild');
        initStripe(stripe);

        const script = document.getElementsByTagName('script')[0];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        script.onload().catch(()=> {
            expect(document.head.appendChild).toBeCalledWith(
                expect.objectContaining({
                    src: 'https://js.stripe.com/v3/',
                })
            );
        });

    });

    test('testing stripeOnload successfully', async () => {
        const stripeContainerDiv = document.createElement('div');
        stripeContainerDiv.className = 'express-payment-container';
        jest.spyOn(document, 'getElementById').mockReturnValue(stripeContainerDiv);

        const showHideExpressPaymentSection = jest.fn();
        const canMakePaymentMock = jest.fn().mockReturnValue(Promise.resolve(true));
        const eventHandlerMock = jest.fn().mockImplementation(async (event, handler) => {
            await handler();
        });
        const stripePaymentObjectMock = {
            canMakePayment: canMakePaymentMock,
            addEventListener: eventHandlerMock
        };
        const stripePaymentRequestMock = jest.fn().mockReturnValue(stripePaymentObjectMock);
        const stripeCreateElementMock = jest.fn().mockReturnValue({mount: jest.fn()});

        window['Stripe'] = jest.fn().mockImplementation();
        jest.spyOn(window, 'Stripe')
            .mockReturnValue({
                paymentRequest: stripePaymentRequestMock,
                elements: jest.fn().mockReturnValue({create: stripeCreateElementMock})
            });
        await stripeOnload(stripe, showHideExpressPaymentSection);

        expect(stripePaymentRequestMock).toHaveBeenCalledTimes(1);
        expect(stripePaymentRequestMock).toBeCalledWith({
            currency: currencyMock.iso_code.toLowerCase(),
            country: stripe.account_country,
            total: {
                label: 'Total',
                amount: orderTotal,
            },
            requestPayerName: true,
            requestPayerEmail: true,
            requestShipping: true,
            requestPayerPhone: orderInitialDataMock.general_settings.checkout_process.phone_number_required,
            displayItems: displayItemMock
        });

        expect(stripeCreateElementMock).toHaveBeenCalledTimes(1);
        expect(stripeCreateElementMock).toBeCalledWith(
            'paymentRequestButton', {
                paymentRequest: stripePaymentObjectMock,
                style: {
                    paymentRequestButton: {
                        type: 'default',
                        theme: 'dark',
                    }
                }
            }
        );
        expect(showHideExpressPaymentSection).toHaveBeenCalledTimes(1);
        expect(checkStripeAddressMock).toHaveBeenCalledTimes(1);
        expect(changeStripeShippingLinesMock).toHaveBeenCalledTimes(1);
    });

    test('testing stripeOnload with failure', async () => {
        jest.spyOn(document, 'getElementById').mockReturnValue(null);

        const showHideExpressPaymentSection = jest.fn();
        const canMakePaymentMock = jest.fn().mockReturnValue(Promise.resolve(false));

        const stripePaymentObjectMock = {
            canMakePayment: canMakePaymentMock,
            addEventListener: jest.fn()
        };
        const stripePaymentRequestMock = jest.fn().mockReturnValue(stripePaymentObjectMock);
        const stripeCreateElementMock = jest.fn().mockReturnValue({mount: jest.fn()});

        window['Stripe'] = jest.fn().mockImplementation();
        jest.spyOn(window, 'Stripe')
            .mockReturnValue({
                paymentRequest: stripePaymentRequestMock,
                elements: jest.fn().mockReturnValue({create: stripeCreateElementMock})
            });
        await stripeOnload(stripe, showHideExpressPaymentSection);

        expect(stripePaymentRequestMock).toHaveBeenCalledTimes(1);
        expect(stripePaymentRequestMock).toBeCalledWith({
            currency: currencyMock.iso_code.toLowerCase(),
            country: stripe.account_country,
            total: {
                label: 'Total',
                amount: orderTotal,
            },
            requestPayerName: true,
            requestPayerEmail: true,
            requestShipping: true,
            requestPayerPhone: orderInitialDataMock.general_settings.checkout_process.phone_number_required,
            displayItems: displayItemMock
        });

        expect(stripeCreateElementMock).toHaveBeenCalledTimes(1);
        expect(stripeCreateElementMock).toBeCalledWith(
            'paymentRequestButton', {
                paymentRequest: stripePaymentObjectMock,
                style: {
                    paymentRequestButton: {
                        type: 'default',
                        theme: 'dark',
                    }
                }
            }
        );
        expect(showHideExpressPaymentSection).toHaveBeenCalledTimes(0);
    });

});
