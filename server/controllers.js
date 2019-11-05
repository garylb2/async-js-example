'use strict';

const data = require('./data/example');

exports.get_all_employees = (req,res) => {
  res.json(data.employees.map(x => {
    return {
      id: x.id
    };
  }));
}

exports.get_employee = (req,res) => {
  const employeeId = Number(req.params.employeeId);
  const entry = data.employees.find(x => x.id === employeeId);

  if( typeof entry !== "undefined") {
    res.json(entry);
  } else {
    res.sendStatus(404);
  }
}

exports.get_all_locations = (req,res) => {
  res.json(data.locations.map(x => {
    return {
      id: x.id
    };
  }));
}

exports.get_location = (req,res) => {
  const locationId = Number(req.params.locationId);
  const entry = data.locations.find(x => x.id === locationId);

  if( typeof entry !== "undefined") {
    res.json(entry);
  } else {
    res.sendStatus(404);
  }
}

exports.get_all_teams = (req,res) => {
  res.json(data.teams.map(x => {
    return {
      id: x.id
    };
  }));
}

exports.get_team = (req,res) => {
  const teamId = Number(req.params.teamId);
  const entry = data.teams.find(x => x.id === teamId);

  if( typeof entry !== "undefined") {
    res.json(entry);
  } else {
    res.sendStatus(404);
  }
}
