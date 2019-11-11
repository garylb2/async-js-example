'use strict';

const rp = require('request-promise-native');

const _async = require('async');
const util = require('util');
const concatLimit = util.promisify(_async.concatLimit);
const retry = util.promisify(_async.retry);

const serverUrl = "http://localhost:3000/limited";
const concurrency = 3;

let numOfCalls = 0;

const retryHandlers = {
  times: 5,
  interval: retryCount => {

    // 20, 40, 80, 160, 320 ms
    const retryDelay = 10* Math.pow(2, retryCount);
    // console.log(`interval: [retryCount: ${retryCount}] [retryDelay: ${retryDelay}]`);
    return retryDelay;
  },
  errorFilter: err => {

    // console.log(`errorFilter ${JSON.stringify(err, null, 2)}`);
    if(typeof err === "undefined" || typeof err.statusCode === "undefined") {
      return true;
    }

    return err.statusCode >= 500 && err.statusCode < 600 ||
        err.statusCode === 408 || err.statusCode === 429;
  }
};

const retryableRequestGet = async function(options) {
    // console.log('retryableRequestGet options', options);
    ++numOfCalls;
    return rp({...options,resolveWithFullResponse: true})
        .then(response => {
            // throw Exception when non-success response
            if(response.statusCode !== 200) {
                throw {
                    statusCode: response.statusCode,
                    body: response.body,
                    message: `Non-Success Response: ${response.statusCode}`
                };
            }

            // otherwise just return
            const ret = {statusCode: response.statusCode, body: response.body};
            // console.log('retryableRequestGet simplified response', ret);
            return ret;
        })
};

const get = async (options) => {

    const boundGet = retryableRequestGet.bind(null, options);

    try {
        const ret = await retry(retryHandlers,
            boundGet
        );

        return ret;
    } catch(e) {
        // translate valid response errors back from an exception
        if(typeof e !== "undefined" && typeof e.statusCode !== "undefined") {
            return e;
        }

        throw e;
    }
};

const getEmployeeData = async (employeeData) => {
  const urlOptions = {
    url: `${serverUrl}/employee/${employeeData.id}`,
    json: true
  }

  const rawEmployeeData = await get(urlOptions);

  return rawEmployeeData.body;
};

const getAllEmployees = async () => {
  const urlOptions = {
    url: `${serverUrl}/employees`,
    json: true
  }

  const rawEmployeesData = await get(urlOptions);
  const concatData = await concatLimit(rawEmployeesData.body, concurrency, getEmployeeData);

  return concatData;
};

exports.getReport = async () => {

  numOfCalls = 0;
  const timeKey = 'RateLimited Employee Report';
  console.time(timeKey);

  let employeesData = await getAllEmployees();

  console.timeEnd(timeKey);
  console.log(`# of API calls: ${numOfCalls}`);

  console.log(employeesData);
}

exports.getReport();
