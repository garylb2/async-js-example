# JavaScript Async Syntax/Patterns

Over the course of the history of JavaScript, there have been three major methods of consuming the results of asynchronous code.
_N.B.: Node.js and every other JS interpreter is single-threaded, and all asynchronous behavior is done with context switching of the single thread._

## CallBacks
The oldest, most venerable method of handling asynchronous behavior in Javascript is the usage of callbacks.  A callback function reference is passed as a parameter to another function that initiates the asynchronous operation and which invokes the callback function with expected result parameters (usually _(err, result)_).

The vast majority of Node.js Library functions use the callback pattern for async, such as [fs.readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback) or [agent.createConnection](https://nodejs.org/api/http.html#http_agent_createconnection_options_callback).

### Limitations
The main limitation of the callback pattern is **Callback Hell**.  Where when you want to do a series of chained asynchronous operations (where a follow-up operation is dependent on a previous one), you have to create either an ever more indented block of code or you have to pass callback functions further and further through different function invocations.

### Library Modernization
Since the Node.js Library functions use the callback pattern, if you want to use them with the more modern patterns, you must modernize them with the following bit of code.

```javascript 1.6
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
```
[node.js library doc](https://nodejs.org/api/util.html#util_util_promisify_original)

With _util.promisify_, you take a function that has a callback as its last parameter and wrap it in a Promise instead.

## Promises
With JavaScript ES6 standard, a standardized Promise object/behavior was introduced.  Node.js having basic support for such since _v0.12_.

### Definitions
A Promise is a wrapper/proxy object, around a segment of asynchronous code, which provides a state machine that tracks the status of the wrapped operation and a [Monad design pattern](#monad-design-pattern) which allows for chained handlers of success/failure.

### Limitations
The main limitation of the ES6 Promise, in my opinion, is readability.  Most implementations require anonymous callback functions inside of the Promise declaration, which is very different from synchronous code.  It can be difficult to follow the flow of control through all of the Monads, and depending how the handlers are attached to the Promise, you can have [unexpected behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#Chaining).

Promises are eager execution, so if you invoke a promise, it will immediately attempt to perform the contained behavior.  If such behavior isn't account for, such eagerness can lead to rate limiting on APIs or excessive memory usage or any number of undesired results.

### Example
Fire and forget chained file reads/prints
```javascript 1.6
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

readFile('./context.json').then((results) => {
    console.debug(results);
    const data = JSON.parse(results);

    for (const fName in data) {
      readFile(fName).then(fContents => {
        console.log(`${fName} -- ${fContents}`);
      }, fErr => {
        console.error(`Error reading ${fName}: ${fErr}`);
      });
    }
  },
  (err) => {
      console.error(`Read File Error: ${err}`);
  }
);
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

### Warning
Given the length of time required before browsers & Node.js implemented the ES6 standard, a number of independent developers created their own solution to avoid the **Callback Hell**.  Libraries, such as Blackbird Promises or Q, can have significant differences from the standardized Promise objects and are not guaranteed to be compatible with the newer ES6 standard.

## async/await
The latest asynchronous pattern in JavaScript & Node.js is the _async/await_ keywords.  Supported in Node.js as of _v7.6.0_.  Using the _async_ keyword before a function definition translates that Function into an [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) which provides an implicit Promise return value, wrapping any explicit return in said Promise.

Inside of an AsyncFunction, you can use the _await_ keyword to cause the local execution to block until the awaited code returns a result.  You can then treat the asynchronous operation as if it were synchronous within the confines of AsyncFunction, because it functionally is synchronous locally.  Failed awaited operations throw exceptions instead of using an Error or onRejected handler, so you just wrap the awaited operation in a try/catch block to handle failures.

### Example
Fire and forget chained file reads/prints
```javascript 1.6
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

const printContentHelper = async (fileName) => {
  try {
    const contents = await readFile(fileName);
    console.log(`${fileName} -- ${contents}`);
  } catch(err) {
    console.error(`Error reading ${fileName}: ${err}`);
  }
};

const printContents = async(rootFileName) => {
  try{
    const fileResults = await readFile();

    console.debug(fileResults);
    const data = JSON.parse(fileResults);

    for (const fName in data) {
      printContentHelper(fName);
    }
  } catch(err) {
    console.error(`Read File Error: ${err}`);
  }
};

printContents('./context.json');
```

##### Footnotes
###### Monad Design Pattern
> Fundamentally a Monad is an object that has methods which return an object with the same interface as the original Monad, but with a mutated internal state.
> One major JS example of at least a partial Monad is [jQuery Objects](https://api.jquery.com/jQuery/#jQuery1).
