<a href="https://promisesaplus.com/">
    <img src="https://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.0 compliant" align="right" />
</a>


# R.js
Yet another promise A+ implementation.  
<b>Implementation passed [Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests). </b>  
Good for learning promise implementation.  
Do not recommend to use in production.  

## API
new R()  
- .then([Function fulfilledHandler] [, Function rejectedHandler ])  
- .catch(Function handler)  
- .fulfill(dynamic result)  
- .reject(dynamic reason)  
- .all([Array of R promise])  
- .race([Array of R promise])  
- .any([Array of R promise])  
- .allSettled([Array of R promise])  

## Tests
`npm run test`

## License
[MIT](https://github.com/RanningMan/R.js/blob/main/LICENSE)
