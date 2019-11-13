# Async Operations Libraries

## General Principles
_**do NOT recreate the wheel** unless you absolutely have to, or the wheel is square._

## async
One of the most venerable libraries used for async JS operations; allowing for all sorts of types of async operations and flow control.  The latest & greatest version (_v3.1.0_) uses both CallBacks and Promises for responses and can easily be tweaked to work with async/await.  The main limitation is that async functions fed to the library methods cannot return Promises to work correctly.  Also, the name is a bit confusing with the async/await syntax.

Can also be used in both Node.js & browser packages.

[async](https://www.npmjs.com/package/async)

## sindresorhus Promise Libraries
A series of smaller libraries for controlling the operational flow of async methods and collate the results of such.

[](https://github.com/sindresorhus/promise-fun)

## Etc.
There's a ton of others that could be used, but be careful to ensure the correctness of library functionality.
