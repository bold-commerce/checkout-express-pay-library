import {
    addGuestCustomer,
    updateCustomer as putGuestCustomer,
    baseReturnObject,
    getApplicationState,
    ICustomer,
    IApplicationState,
} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {callGuestCustomerEndpoint} from 'src';

jest.mock('@bold-commerce/checkout-frontend-library/lib/customer');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
const addGuestCustomerMock = mocked(addGuestCustomer, true);
const putGuestCustomerMock = mocked(putGuestCustomer, true);
const getApplicationStateMock = mocked(getApplicationState, true);

describe('testing callGuestCustomerEndpoint function', () => {
    const successReturnObject = {...baseReturnObject, success: true};
    const loggedInCustomer = {platform_id: '1234',email_address: 'test@gmail.com', first_name:'John', last_name: 'steve' };
    const emptyCustomer = {platform_id: '',email_address: '', first_name:'', last_name: '' };
    const nonEmptyCustomer = {platform_id: '0',email_address: 'test@gmail.com', first_name:'John', last_name: 'steve' };

    beforeEach(() => {
        jest.resetAllMocks();
        addGuestCustomerMock.mockReturnValueOnce(Promise.resolve(successReturnObject));
        putGuestCustomerMock.mockReturnValueOnce(Promise.resolve(successReturnObject));
    });

    const data = [
        {name: 'testing with login user', firstName: 'John', lastName: 'steve', email: 'test@gmail.com', getAppState: loggedInCustomer, addGuest: 0, putGuest: 0, returnObj: successReturnObject},
        {name: 'testing with empty user', firstName: '', lastName: '', email: '', getAppState: emptyCustomer, addGuest: 1, putGuest: 0, returnObj: successReturnObject},
        {name: 'testing with updated user', firstName: 'test', lastName: 'steve', email: 'tests@gmail.com', getAppState: nonEmptyCustomer, addGuest: 0, putGuest: 1, returnObj: successReturnObject},
        {name: 'testing with same user', firstName: 'John', lastName: 'steve', email: 'test@gmail.com', getAppState: nonEmptyCustomer, addGuest: 0, putGuest: 0, returnObj: successReturnObject},
    ];

    test.each(data)('$name', async ({firstName, lastName, email, getAppState, addGuest, putGuest, returnObj}) => {
        const customer = getAppState as ICustomer;
        getApplicationStateMock.mockReturnValueOnce({customer} as IApplicationState);
        const result = await callGuestCustomerEndpoint(firstName, lastName, email);
        expect(result).toStrictEqual(returnObj);
        expect(addGuestCustomerMock).toHaveBeenCalledTimes(addGuest);
        expect(putGuestCustomerMock).toHaveBeenCalledTimes(putGuest);
    });

});
