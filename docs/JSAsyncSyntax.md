# JavaScript Async Syntax/Patterns

Over the course of the history of JavaScript, there have been three major methods of consuming the results of asynchronous code.  Each of these patterns are built upon each other, where promises wrap a callback with an interface and _async/await_ is syntactic sugar for Promises.  (_it is the sweetest of syntactic sugar, in my opinion_)

_N.B.: Node.js and every other JS interpreter is single-threaded, and all asynchronous behavior is done with context switching of the single thread._

## Callbacks
```function asyncOp(param1, callback);```

[Callbacks](AsyncCallbacks.md)

## Promises
```
new Promise((resolve, reject) => { 
    // do something asynchronously
})
```

[Promises](AsyncPromises.md)

## async/await
```
async (param1) => {
    return await asyncOp(param1);
}
```

[async/await keywords](AsyncAwaitKeywords.md)
