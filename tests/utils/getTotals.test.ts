import {getTotals} from 'src/utils';
import {applicationStateMock, feesMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {mocked} from 'jest-mock';
import {
    getApplicationState,
    getDiscounts,
    getFees,
    getLineItems,
    getPayments,
    getTaxes
} from '@boldcommerce/checkout-frontend-library';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
const getLineItemsMock = mocked(getLineItems, true);
const getPaymentsMock = mocked(getPayments, true);
const getTaxesMock = mocked(getTaxes, true);
const getFeesMock = mocked(getFees, true);
const getDiscountsMock = mocked(getDiscounts, true);
const getApplicationStateMock = mocked(getApplicationState, true);

describe('testing getTotals', () => {
    const paymentMock = {...applicationStateMock.payments[0], value: 1000};
    const paymentsMock = [paymentMock];
    const dataProvider = [
        {
            name: 'getTotals with success',
            mockLineItems: applicationStateMock.line_items,
            mockPayments: applicationStateMock.payments,
            mockTaxes: applicationStateMock.taxes,
            mockFees: [],
            mockDiscounts: applicationStateMock.discounts,
            mockOrderTotal: 22099,
            mockTotals: {
                totalSubtotal: 1003,
                totalOrder: 22099,
                totalAmountDue: 21099,
                totalPaid: 1000,
                totalFees: 3,
                totalAdditionalFees: 0,
                totalTaxes: 0,
                totalDiscounts: 1
            }
        },
        {
            name: 'getTotals without line items array',
            mockLineItems: [],
            mockPayments: paymentsMock,
            mockTaxes: applicationStateMock.taxes,
            mockFees: [],
            mockDiscounts: applicationStateMock.discounts,
            mockOrderTotal: 1999,
            mockTotals: {
                totalSubtotal: 0,
                totalOrder: 1999,
                totalAmountDue: 999,
                totalPaid: 1000,
                totalFees: 0,
                totalAdditionalFees: 0,
                totalTaxes: 0,
                totalDiscounts: 1
            }
        },
        {
            name: 'getTotals without payments array',
            mockLineItems: applicationStateMock.line_items,
            mockPayments: [],
            mockTaxes: applicationStateMock.taxes,
            mockFees: [],
            mockDiscounts: applicationStateMock.discounts,
            mockOrderTotal: 22099,
            mockTotals: {
                totalSubtotal: 1003,
                totalOrder: 22099,
                totalAmountDue: 22099,
                totalPaid: 0,
                totalFees: 3,
                totalAdditionalFees: 0,
                totalTaxes: 0,
                totalDiscounts: 1
            }
        },
        {
            name: 'getTotals without taxes array',
            mockLineItems: applicationStateMock.line_items,
            mockPayments: applicationStateMock.payments,
            mockTaxes: [],
            mockFees: [],
            mockDiscounts: applicationStateMock.discounts,
            mockOrderTotal: 22089,
            mockTotals: {
                totalSubtotal: 1003,
                totalOrder: 22089,
                totalAmountDue: 21089,
                totalPaid: 1000,
                totalFees: 3,
                totalAdditionalFees: 0,
                totalTaxes: 0,
                totalDiscounts: 1
            }
        },
        {
            name: 'getTotals without discounts array',
            mockLineItems: applicationStateMock.line_items,
            mockPayments: applicationStateMock.payments,
            mockTaxes: applicationStateMock.taxes,
            mockFees: [],
            mockDiscounts: [],
            mockOrderTotal: 22109,
            mockTotals: {
                totalSubtotal: 1003,
                totalOrder: 22109,
                totalAmountDue: 21109,
                totalPaid: 1000,
                totalFees: 3,
                totalAdditionalFees: 0,
                totalTaxes: 0,
                totalDiscounts: 0
            }
        },
        {
            name: 'getTotals with fees array',
            mockLineItems: applicationStateMock.line_items,
            mockPayments: applicationStateMock.payments,
            mockTaxes: applicationStateMock.taxes,
            mockFees: [feesMock],
            mockDiscounts: [],
            mockOrderTotal: 23309,
            mockTotals: {
                totalSubtotal: 1003,
                totalOrder: 23309,
                totalAmountDue: 22309,
                totalPaid: 1000,
                totalFees: 3,
                totalAdditionalFees: 1200,
                totalTaxes: 0,
                totalDiscounts: 0
            }
        },
        {
            name: 'getTotals with undefined fees',
            mockLineItems: applicationStateMock.line_items,
            mockPayments: applicationStateMock.payments,
            mockTaxes: applicationStateMock.taxes,
            mockFees: undefined,
            mockDiscounts: [],
            mockOrderTotal: 22109,
            mockTotals: {
                totalSubtotal: 1003,
                totalOrder: 22109,
                totalAmountDue: 21109,
                totalPaid: 1000,
                totalFees: 3,
                totalAdditionalFees: 0,
                totalTaxes: 0,
                totalDiscounts: 0
            }
        },
    ];

    test.each(dataProvider)(
        '$name',
        ({mockLineItems, mockPayments, mockTaxes, mockFees, mockDiscounts, mockOrderTotal, mockTotals}) => {
            getLineItemsMock.mockReturnValueOnce(mockLineItems);
            getPaymentsMock.mockReturnValueOnce(mockPayments);
            getTaxesMock.mockReturnValueOnce(mockTaxes);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            getFeesMock.mockReturnValueOnce(mockFees);
            getDiscountsMock.mockReturnValueOnce(mockDiscounts);
            getApplicationStateMock.mockReturnValueOnce({...applicationStateMock, order_total: mockOrderTotal});

            const totals = getTotals();

            expect(totals).toStrictEqual(mockTotals);
        });
});
