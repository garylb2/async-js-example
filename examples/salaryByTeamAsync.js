'use strict';

const rp = require('request-promise-native');

const _async = require('async');
const util = require('util');
const concatLimit = util.promisify(_async.concatLimit);

const serverUrl = "http://localhost:3000";
const concurrency = 3;

const salaryReport = require('./reports/teamSalaries');

let numOfCalls = 0;

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
        });
};

const getEmployeeData = async (employeeData) => {
  const urlOptions = {
    url: `${serverUrl}/employee/${employeeData.id}`,
    json: true
  };

  const rawEmployeeData = await retryableRequestGet(urlOptions);

  return rawEmployeeData.body;
};

const getAllEmployees = async () => {
  const urlOptions = {
    url: `${serverUrl}/employees`,
    json: true
  };

  const rawEmployeesData = await retryableRequestGet(urlOptions);
  const concatData = await concatLimit(rawEmployeesData.body, concurrency, getEmployeeData);

  return concatData;
};

const getTeamData = async (teamData) => {
  const urlOptions = {
    url: `${serverUrl}/team/${teamData.id}`,
    json: true
  };

  const rawTeamData = await retryableRequestGet(urlOptions);

  return rawTeamData.body;
};

const getAllTeams = async () => {
  const urlOptions = {
    url: `${serverUrl}/teams`,
    json: true
  };

  const rawTeamsData = await retryableRequestGet(urlOptions);
  const concatData = await concatLimit(rawTeamsData.body, concurrency, getTeamData);

  return concatData;
};

const getTeamObj = async () => {
  const teamsData = await getAllTeams();

  const teamsObj = {};
  teamsData.forEach((item) => {
    const teamKey = `team${item.id}`;
    teamsObj[teamKey] = item;
  });

  return teamsObj;
};

exports.getReport = async () => {

  numOfCalls = 0;
  const timeKey = 'Team Salary Report';
  console.time(timeKey);

  // make all async calls as overlapping as possible
  let employeesData = getAllEmployees();
  let teamsObj = getTeamObj();

  // wait for all
  employeesData = await employeesData;
  teamsObj = await teamsObj;

  // generate report
  const teamSalaries = salaryReport.report(employeesData, teamsObj);

  console.timeEnd(timeKey);
  console.log(`# of API calls: ${numOfCalls}`);

  console.log(teamSalaries);
};

exports.getReport();
