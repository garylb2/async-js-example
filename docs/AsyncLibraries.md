# Async Operations Libraries

## General Principles
_**do NOT recreate the wheel** unless you absolutely have to, or the wheel is square._

## async Library
One of the most venerable libraries used for async JS operations; allowing for all sorts of types of async operations and flow control.  The latest & greatest version (_v3.1.0_) uses both callbacks and Promises for responses and can easily be tweaked to work with async/await.  The library developers have heavily [https://caolan.github.io/async/v3/](documented) the different methods with examples, although most examples assume the use of callbacks.

_N.B._: [concatLimit](https://caolan.github.io/async/v3/docs.html#concatLimit) & [mapValuesLimit](https://caolan.github.io/async/v3/docs.html#mapValuesLimit) are the most helpful for async return values with [parallelLimit](https://caolan.github.io/async/v3/docs.html#parallelLimit) being most helpful for fire & forget async functions.  Although there's a large number of additional method options for specific desired behavior other than just collect async data or do a series of void return async operations.

### Limitations
The main limitation is that async functions fed to the library methods cannot return Promises to work correctly.  Also, the name is a bit confusing with the _async/await_ syntax.

Can also be used in both Node.js & browser packages.

### Reference
[async Node Package](https://www.npmjs.com/package/async)

## sindresorhus Promise Libraries
A series of smaller libraries for controlling the operational flow of async methods and collate the results of such.

### Limitations
Requires investigation into the various packages to determine which one will actually work for your specific use case.  There's also no central documentation; although each package does seem to be decently documented.

### Reference
[sindresorhus Promise Libraries](https://github.com/sindresorhus/promise-fun)

## Etc.
There's a ton of others that could be used, but be careful to ensure the correctness of library functionality.
