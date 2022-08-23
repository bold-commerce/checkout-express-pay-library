import {getPaypalUrl} from 'src';

describe('testing getPaypalUrl function', () => {
    const withCallbackAllFalseTestSet = [
        {
            clientId: '',
            debug: false,
            currency: '',
            expectedUrl: 'https://www.paypal.com/sdk/js?client-id=&debug=false&currency=&disable-funding=credit%2Ccard%2Cvenmo%2Csepa%2Cbancontact%2Ceps%2Cgiropay%2Cideal%2Cmybank%2Cp24%2Csofort&vault=true&intent=authorize&integration-date=2020-03-10'
        },
        {
            clientId: 'someClientId',
            debug: true,
            currency: 'CAD',
            expectedUrl: 'https://www.paypal.com/sdk/js?client-id=someClientId&debug=true&currency=CAD&disable-funding=credit%2Ccard%2Cvenmo%2Csepa%2Cbancontact%2Ceps%2Cgiropay%2Cideal%2Cmybank%2Cp24%2Csofort&vault=true&intent=authorize&integration-date=2020-03-10'
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each(withCallbackAllFalseTestSet)('testing clientId: $clientId, debug: $debug and currency: $currency', ({clientId, debug, currency, expectedUrl}) => {
        const paypalUrl = getPaypalUrl(clientId, debug, currency);

        expect(paypalUrl).toBe(expectedUrl);
    });

});
