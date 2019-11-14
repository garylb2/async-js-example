# Promises
With JavaScript ES6 standard, a standardized Promise object/behavior was introduced.  Node.js having basic support for such since _v0.12_.

## Definitions
A Promise is a wrapper/proxy object, around a segment of asynchronous code, which provides a state machine that tracks the status of the wrapped operation and a [Monad design pattern](#monad-design-pattern) which allows for chained handlers of success/failure.

## Limitations
The main limitation of the ES6 Promise, in my opinion, is readability.  Most implementations require anonymous callback functions inside of the Promise declaration, which is very different from synchronous code.  It can be difficult to follow the flow of control through all of the Monads, and depending how the handlers are attached to the Promise, you can have [unexpected behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#Chaining).

Promises are eager execution, so if you invoke a Promise, it will immediately attempt to perform the contained behavior.  If such behavior isn't account for, such eagerness can lead to rate limiting on APIs or excessive memory usage or any number of undesired results.

## Example
Fire and forget chained file reads/prints
```javascript 1.6
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

readFile('./context.json')
  .then((results) => {
      console.debug(results);
      const data = JSON.parse(results);
      return data;
    }, (err) => {
        console.error(`Read File Error: ${err}`);
    }
  ).then((data) => {
    for (const fName in data) {
      readFile(fName).then(fContents => {
        console.log(`${fName} -- ${fContents}`);
      }, fErr => {
        console.error(`Error reading ${fName}: ${fErr}`);
      });
    }
  });
```

##### Why Use util.promisfy
readFile Promise generator w/o promisify to demonstrate why you should just use promisfy when you can.
```javascript 1.6
const fs = require('fs');
const readFile = (fileName) => {
  // resolve is the callback that matches up with the onFullfilled event handler
  // reject is the callback that matches up with onRejected event handler
  return new Promise((resolve, reject) => {
      fs.readFile(fileName, (err, results) => {
        if(err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
  });
};
```
[executable version](../examples/fsTest.js)

## Warning
Given the length of time required before browsers & Node.js implemented the ES6 standard, a number of independent developers created their own solution to avoid the **Callback Hell**.  Libraries, such as Blackbird Promises or Q, can have significant differences from the standardized Promise objects and are not guaranteed to be compatible with the newer ES6 standard.

-----
##### Footnotes
###### Monad Design Pattern
> Fundamentally a Monad is an object that has methods which return an object with the same interface as the original Monad, but with a mutated internal state.
> One major JS example of at least a partial Monad is [jQuery Objects](https://api.jquery.com/jQuery/#jQuery1).
