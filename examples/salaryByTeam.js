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

const getTeamData = async (teamData) => {
  const urlOptions = {
    url: `${serverUrl}/team/${teamData.id}`,
    json: true
  }

  const rawTeamData = await retryableRequestGet(urlOptions);

  return rawTeamData.body;
};

const getAllTeams = async () => {
  const urlOptions = {
    url: `${serverUrl}/teams`,
    json: true
  }

  const rawTeamsData = await retryableRequestGet(urlOptions);
  const concatData = await concatLimit(rawTeamsData.body, 3, getTeamData);

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

  const timeKey = 'Team Salary Report';
  console.time(timeKey);

  const employeesData = await getAllEmployees();

  const teamsObj = await getTeamObj();

  let teamSalaries = employeesData.reduce((accumulator, item) => {
    if (accumulator.hasOwnProperty('id')) {
      accumulator = {};
    }

    const teamId = item.teamId;
    const teamKey = `team${teamId}`;
    const teamName = teamsObj[teamKey].name;

    if (!accumulator.hasOwnProperty(teamName)) {
      accumulator[teamName] = 0;
    }

    accumulator[teamName] += item.salary;
    return accumulator;
  });

  console.timeEnd(timeKey);

  console.log(teamSalaries);
}

exports.getReport();
