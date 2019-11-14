# async/await Keywords
The latest asynchronous pattern in JavaScript & Node.js is the _async/await_ keywords.  Supported in Node.js as of _v7.6.0_.  Using the _async_ keyword before a function definition translates that Function into an [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) which provides an implicit Promise return value, wrapping any explicit return in said Promise.

Inside of an AsyncFunction, you can use the _await_ keyword to cause the local execution to block until the awaited code returns a result.  You can then treat the asynchronous operation as if it were synchronous within the confines of AsyncFunction, because it functionally is synchronous locally.  Failed awaited operations throw exceptions instead of using an Error or onRejected handler, so you just wrap the awaited operation in a try/catch block to handle failures.

## Example
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

const printContents = async (rootFileName) => {
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