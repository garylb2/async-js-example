# JavaScript Async Syntax/Patterns

Over the course of the history of JavaScript, there have been three major methods of consuming the results of asynchronous code.

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
With JavaScript ES6 standard, a standardized Promise object/behavior was introduced.  Node.js having basic support for such since v0.12.

### Definitions
A Promise is a wrapper/proxy object, around a segment of asynchronous code, which provides a state machine that tracks the status of the wrapped operation and a Monad design pattern which allows for chained handlers of success/failure.

### Limitations
...

### Warning
Given the length of time required before browsers & Node.js implemented the ES6 standard, a number of independent developers created their own solution to avoid the **Callback Hell**.  Libraries, such as Blackbird Promises, have signficant differences from the standardized Promise objects and are generally not compatible with the newer standard.

## async/await
The latest asynchronous pattern in JavaScript & Node.js is the _async/await_ keywords.  Supported in Node.js as of _v7.6.0_.  Using the _async_ keyword before a function definition translates that Function into an [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) which provides an implicit Promise return value, wrapping any explicit return in said Promise.