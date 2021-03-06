'use strict';
const request = require('sync-request');
const serverUrl = "http://localhost:3000";

let numOfCalls = 0;

const salaryReport = require('./reports/teamSalaries');

const requestGet = function(options) {
    // console.log('retryableRequestGet options', options);
    ++numOfCalls;
    const res = request('GET', options.url);
    return res.getBody('utf8');
};

const getEmployeeData = (employeeData) => {
  const urlOptions = {
    url: `${serverUrl}/employee/${employeeData.id}`,
    json: true
  };

  const rawEmployeeData = requestGet(urlOptions);

  return JSON.parse(rawEmployeeData);
};

const getAllEmployees = () => {
  const urlOptions = {
    url: `${serverUrl}/employees`,
    json: true
  };

  const rawEmployeesData = requestGet(urlOptions);
  const employeesData = JSON.parse(rawEmployeesData);

  const concatData = [];
  for (let i =0; i < employeesData.length; ++i) {
    concatData.push(getEmployeeData(employeesData[i]));
  }

  return concatData;
};

const getTeamData = (teamData) => {
  const urlOptions = {
    url: `${serverUrl}/team/${teamData.id}`,
    json: true
  };

  const rawTeamData = requestGet(urlOptions);
  const parsedTeamData = JSON.parse(rawTeamData);

  return parsedTeamData;
};

const getAllTeams = () => {
  const urlOptions = {
    url: `${serverUrl}/teams`,
    json: true
  };

  const rawTeamsData = requestGet(urlOptions);
  const teamsData = JSON.parse(rawTeamsData);

  const concatData = [];
  for (let i =0; i < teamsData.length; ++i) {
    concatData.push(getTeamData(teamsData[i]));
  }

  return concatData;
};

const getTeamObj = () => {
  const teamsData = getAllTeams();

  const teamsObj = {};
  teamsData.forEach((item) => {
    const teamKey = `team${item.id}`;
    teamsObj[teamKey] = item;
  });

  return teamsObj;
};

exports.getReport = () => {

  numOfCalls = 0;
  const timeKey = 'Team Salary Report';
  console.time(timeKey);

  // synchronously collect all employee data
  const employeesData = getAllEmployees();
  // synchronously collect all team data
  const teamsObj = getTeamObj();

  // generate report
  const teamSalaries = salaryReport.report(employeesData, teamsObj);

  console.timeEnd(timeKey);
  console.log(`# of API calls: ${numOfCalls}`);

  console.log(teamSalaries);
};

exports.getReport();
