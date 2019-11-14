const fs = require('fs');

// custom Promise generating wrapper of the fs.readFile method
const readFile = (fileName) => {
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

readFile('./server/data/example.json').then(results => {
    console.debug(results.toString());
  }, err => {
    console.error(`Read File Error: ${err}`);
  }
);
