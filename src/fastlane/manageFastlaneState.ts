import {IFastlaneInstance, IFastlaneOptions} from 'src/types';
import {fastlaneState} from 'src/variables';
import {initFastlane} from './initFastlane';

/**
 * Gets an instance of Fastlane. If the instance has not yet been initialized then
 * one will be initialized and returned asynchronously. Calls to `getFastlaneInstance` while
 * and instance is being initialized will return the same promise, avoiding duplicate initializations
 * of the Fastlane instance.
 */
export const getFastlaneInstance = async (options?: IFastlaneOptions): Promise<IFastlaneInstance> => {
    return fastlaneState.instance ?? (fastlaneState.instance = initFastlane(options).catch((e) => {
        // Clearing the rejected promise from state so we can try again
        fastlaneState.instance = null;
        throw e;
    }));
};