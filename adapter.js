import { R } from './r.js';

const adapter = {
    resolved: (value) => R.resolve(value),
    rejected: (err) => R.reject(err),
    deferred: () => {
        let resolve, reject;
        const promise = new R((res, rej) => {
            resolve = res;
            reject = rej;
        })
        return {
            promise: promise,
            resolve,
            reject
        }
    }
}

export default adapter;