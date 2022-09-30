import promisesAplusTests from 'promises-aplus-tests';

import Adapter from './adapter.js';

promisesAplusTests(Adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    console.log(`Error summary: ${err}`)
});