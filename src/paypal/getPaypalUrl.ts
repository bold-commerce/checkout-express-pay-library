export function getPaypalUrl(clientId: string, debug: boolean, currency: string): string {
    const paypalBaseUrl = 'https://www.paypal.com/sdk/js';
    const params = {
        'client-id': clientId,
        'debug': debug ? 'true' : 'false',
        'currency': currency,
        'disable-funding': 'credit,card,venmo,sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort',
        'vault': 'true',
        'intent': 'authorize',
        'integration-date': '2020-03-10'
    };
    const urlSearchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        urlSearchParams.append(key, value);
    });

    const paramsString = urlSearchParams.toString();
    const paypalScriptUrl = new URL(paypalBaseUrl);

    paypalScriptUrl.search = `?${paramsString}`;

    return paypalScriptUrl.toString();
}
