'use strict';

const rp = require('request-promise-native');

const serverUrl = "http://localhost:3000";
const concurrency = 3;
const pLimit = require('p-limit');

let numOfCalls = 0;

// uses p-limit library to limit concurrency of promises
const _accumulateLimit = (coll, concurrency, promiseFunc) => {

  const promiseResponse = new Promise((resolve, reject) => {
    if( typeof coll === "undefined" || typeof coll.map === "undefined") {
      reject(new TypeError('Expected `collection` to be an iterable collection'));
    }
    const limit = pLimit(concurrency);

    let p = coll.map(elem => {
      return limit(() => promiseFunc(elem));
    });

    const retValues = results => {resolve(results)};

    Promise.all(p).then(retValues, retValues);
  });

  return promiseResponse;
}

// returns a promise
const retryableRequestGet = function(options) {
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

const getEmployeeData = (employeeData) => {
  const urlOptions = {
    url: `${serverUrl}/employee/${employeeData.id}`,
    json: true
  }

  const employeeDataPromise = new Promise((resolve,reject) => {
    retryableRequestGet(urlOptions)
      .then(rawEmployeeData => {
        // console.log(rawEmployeeData.body);
        resolve(rawEmployeeData.body);
      }, err => reject(err));
    });

  return employeeDataPromise;
};

const getAllEmployees = () => {
  const urlOptions = {
    url: `${serverUrl}/employees`,
    json: true
  }

  const allEmployeesPromise = new Promise((resolve,reject) => {
    retryableRequestGet(urlOptions)
    .then(rawEmployeesData => {
      const a = _accumulateLimit(rawEmployeesData.body, concurrency, getEmployeeData);
      a.then( results => resolve(results), results => reject(results));
    }, err => reject(err));
  });

  // console.log(allEmployeesPromise);
  return allEmployeesPromise;
};

const getTeamData = (teamData) => {
  const urlOptions = {
    url: `${serverUrl}/team/${teamData.id}`,
    json: true
  }

  const teamDataPromise = new Promise((resolve,reject) => {
    retryableRequestGet(urlOptions)
      .then(rawTeamData => {
        // console.log(rawTeamData.body);
        resolve(rawTeamData.body);
      }, err => reject(err));
    });

  return teamDataPromise;
};

const getAllTeams = () => {
  const urlOptions = {
    url: `${serverUrl}/teams`,
    json: true
  }

  const allTeamsPromise = new Promise((resolve,reject) => {
    retryableRequestGet(urlOptions)
    .then(rawTeamsData => {
      const a = _accumulateLimit(rawTeamsData.body, concurrency, getTeamData);
      a.then( results => resolve(results), results => reject(results));
    }, err => reject(err));
  });

  return allTeamsPromise;
};

// must return a promise to handle async internal call
const getTeamObj = () => {
  const teamObjPromise = new Promise((resolve, reject) => {
    getAllTeams().then(teamsData => {
      const teamsObj = {};
      teamsData.forEach((item) => {
        const teamKey = `team${item.id}`;
        teamsObj[teamKey] = item;
      });

      resolve(teamsObj);
    }, err => reject(err));
  });

  return teamObjPromise;
};


exports.getReport = () => {

  numOfCalls = 0;
  const timeKey = 'Team Salary Report';
  console.time(timeKey);

  const teamsObjPromise = getTeamObj();
  const employeesDataPromise = getAllEmployees();

  Promise.all([employeesDataPromise, teamsObjPromise])
    .then((results) => {
      const employeesData = results[0];
      const teamsObj = results[1];

      // console.log(results);
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
      console.log(`# of API calls: ${numOfCalls}`);

      console.log(teamSalaries);
    });
}

exports.getReport();
