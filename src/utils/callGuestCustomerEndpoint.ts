import {
    addGuestCustomer,
    baseReturnObject,
    getApplicationState,
    IApiReturnObject,
    updateCustomer as putGuestCustomer,
} from '@bold-commerce/checkout-frontend-library';
import {API_RETRY, isObjectEmpty, isObjectEquals} from 'src';

export async function callGuestCustomerEndpoint(firstName: string, lastName: string, email: string): Promise<IApiReturnObject> {
    const successReturnObject = {...baseReturnObject, success: true};
    const {customer: prevCustomer} = getApplicationState();
    const previous = {
        email: prevCustomer.email_address,
        firstName: prevCustomer.first_name,
        lastName: prevCustomer.last_name
    };
    const userLogin = !!prevCustomer.platform_id && prevCustomer.platform_id !== '0';
    if (!userLogin) {
        if (isObjectEmpty(previous)) {
            return await addGuestCustomer(firstName, lastName, email, prevCustomer.accepts_marketing, API_RETRY);
        } else if (!isObjectEquals({firstName, lastName, email}, previous)) {
            return await putGuestCustomer(firstName, lastName, email, prevCustomer.accepts_marketing, API_RETRY);
        } else {
            return successReturnObject;
        }
    } else {
        return successReturnObject;
    }
}
