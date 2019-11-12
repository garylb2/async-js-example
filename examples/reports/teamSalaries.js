
exports.report = (employeesData, teamsObj) => {

  // reduce all of the employee data down to a report object
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

  return teamSalaries;
};
