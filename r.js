'use strict';

const STATES = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

const CALLBACK_TYPES = {
  FULFILL: 'fulfill',
  REJECT: 'reject'
}

class MyPromise {
  constructor(executor) {
    this._value = undefined;
    this._reason = undefined;
    this._state = STATES.PENDING;
    this._onFulfilledArr = [];
    this._onRejectedArr = [];
    this._resolve = (val) => {
      if(this._state === STATES.PENDING) {
        queueMicrotask(() => {
          try {
            for(let fn of this._onFulfilledArr) {
              fn(val);
            }
            this._value = val;
            this._state = STATES.FULFILLED;
          } catch(error) {
            this._reject(error);
          }
        });
      }
    }
    
    this._reject = (reason) => {
      if(this._state === STATES.PENDING) {
        queueMicrotask(() => {
          try {
            for(let fn of this._onRejectedArr) {
              fn(reason);
            }
            this._reason = reason;
            this._state = STATES.REJECTED;
          } catch(error) {
            this._reject(error);
          }
        }) 
      }
    }
    
    this._handleCallbackFunc = (callback, resolve, reject, callbackType, promise, value) => {
      try {
        if(typeof callback !== 'function') {
          if(callbackType === CALLBACK_TYPES.FULFILL) {
            resolve(value);
          } else {
            reject(value);
          }
        }
        else {
          promise_resolution_procedure(promise, callback(value));
        }
      } catch(error) {
        reject(error);
      }
    }

    const promise_resolution_procedure = (promise, x) => {
      if(promise === x) {
        throw TypeError('`promise` and `x` refer to the same object');
      }
      
      if(x && (typeof x === 'object' || typeof x === 'function')) {
        try {
          let then = x.then;
          if(typeof then === 'function') {
            let executed = false;
            const resolvePromise = (y) => {
              if(!executed) {
                executed = true;
                promise_resolution_procedure(promise, y);
              }
            }
            const rejectPromise = (r) => {
              if(!executed) {
                executed = true;
                promise._reject(r);
              }
            }
            try {
              then.call(x, resolvePromise, rejectPromise);
            } catch(e) {
              if(!executed) {
                executed = true;
                promise._reject(e);
              }
            }
          } else {
            promise._resolve(x);
          }
        } catch(e) {
          promise._reject(e);
        }
      } else {
        promise._resolve(x);
      }
    }
    
    try {
      executor(this._resolve, this._reject);
    } catch(error) {
      this._reject(error);
    }
  }
  
  then(onFulfilled, onRejected) {
    let promise = new MyPromise((resolve, reject) => {
      if(this._state === STATES.PENDING) {
        this._onFulfilledArr.push((val) => {
          this._handleCallbackFunc(onFulfilled, resolve, reject, CALLBACK_TYPES.FULFILL, promise, val);
        });
        this._onRejectedArr.push((val) => {
          this._handleCallbackFunc(onRejected, resolve, reject, CALLBACK_TYPES.REJECT, promise, val);
        });
      }
      if(this._state === STATES.FULFILLED) {
        this._handleCallbackFunc(onFulfilled, resolve, reject, CALLBACK_TYPES.FULFILL, null, this._value);
      }
      if(this._state === STATES.REJECTED) {
        this._handleCallbackFunc(onRejected, resolve, reject, CALLBACK_TYPES.REJECT, null, this._reason);
      }
    });
    return promise;
  }
  
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  
  finally(onFinallyFunc) {
    return this.then(onFinallyFunc);
  }
  
  static resolve(value) {
    if(value instanceof MyPromise) {
      return value;
    }
    if(typeof value === 'object' || typeof value === 'function') {
      try {
        let then = value.then;
        if(typeof then === 'function') {
          return new MyPromise(then.bind(value))
        }
      } catch(e) {
        return MyPromise.reject(e);
      }
    }
    return new MyPromise((res) => res(value));
  }
  
  static reject(value) {
    return new MyPromise((undefined, rej) => rej(value));
  }
  
  static all(arr) {
    let len = arr.length;
    if(len === 0) {
      return MyPromise.resolve([]);
    }
    return new MyPromise((res, rej) => {
      let result = new Array(len);
      let pending = len;
      for(let i = 0; i < len; i++) {
        MyPromise.resolve(arr[i]).then(val => {
          pending--;
          result[i] = val;
          if(pending === 0) {
            res(result);
          }
        }).catch(err => {
          rej(err);
        });
      }
    });
  }
  
  static race(arr) {
    let len = arr.length;
    return new MyPromise((res, rej) => {
      for(let i = 0; i < len; i++) {
        MyPromise.resolve(arr[i]).then(val => {
          res(val);
        }).catch(err => {
          rej(err);
        });
      }
    });
  }
  
  static any(arr) {
    let len = arr.length;
    if(len === 0) {
      return MyPromise.resolve([]);
    }
    return new MyPromise((res, rej) => {
      let result = new Array(len);
      let hasError = false;
      for(let i = 0; i < len; i++) {
        MyPromise.resolve(arr[i]).then(val => {
          if(!hasError) {
            result[i] = val;
          }
        }).catch(err => {
          hasError = true;
          rej(err);
        });
      }
      res(result);
    });
  }
  
  static allSettled() {
    let len = arr.length;
    if(len === 0) {
      return MyPromise.resolve([]);
    }
    return new MyPromise((res, rej) => {
      let result = new Array(len);
      for(let i = 0; i < len; i++) {
        MyPromise.resolve(arr[i]).then(val => {
          result[i] = {status: 'fulfilled', value: val};
        }).catch(err => {
          result[i] = {status: 'rejected', value: err};
        });
      }
      res(result);
    });
  }
}

export { MyPromise as R };