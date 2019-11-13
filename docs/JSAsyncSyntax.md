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
...

## async/await
...
