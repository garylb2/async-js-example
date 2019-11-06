'use strict';

const rp = require('request-promise-native');

const _async = require('async');
const util = require('util');
const concatLimit = util.promisify(_async.concatLimit);

const serverUrl = "http://localhost:3000";

const retryableRequestGet = async function(options) {
    // logger.trace('retryableRequestGet options', options);
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
            // logger.trace('retryableRequestGet simplified response', ret);
            return ret;
        })
};

const getEmployeeData = async (employeeData) => {
  const urlOptions = {
    url: `${serverUrl}/employee/${employeeData.id}`,
    json: true
  }

  const rawEmployeeData = await retryableRequestGet(urlOptions);

  return rawEmployeeData.body;
};

const getAllEmployees = async () => {
  const urlOptions = {
    url: `${serverUrl}/employees`,
    json: true
  }

  const rawEmployeesData = await retryableRequestGet(urlOptions);
  const concatData = await concatLimit(rawEmployeesData.body, 3, getEmployeeData);

  return concatData;
};

exports.getReport = async () => {

  const employeesData = await getAllEmployees();

  let teamSalaries = employeesData.reduce((accumulator, item) => {
    if (accumulator.hasOwnProperty('id')) {
      accumulator = {};
    }

    const teamId = item.teamId;
    const teamKey = `team${teamId}`;

    if (!accumulator.hasOwnProperty(teamKey)) {
      accumulator[teamKey] = 0;
    }

    accumulator[teamKey] += item.salary;
    return accumulator;
  });


  console.log(teamSalaries);
}

exports.getReport();
