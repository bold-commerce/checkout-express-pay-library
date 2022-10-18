import {loadCustomScript} from '@paypal/paypal-js';
import {isJSAdded} from 'src';

export async function loadJS(url: string, onLoad?: () => unknown , options?: Record<string, string>): Promise<void> {
    if (!isJSAdded(url)) {
        await loadCustomScript({url, attributes: options});
    }

    if (isJSAdded(url)) {
        onLoad && onLoad();
        return Promise.resolve();
    } else {
        return Promise.reject('Script tag not added');
    }
}
