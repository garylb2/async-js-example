'use strict';

const data = require('./data/example');

const getAll = (res, list) => {
  res.json(list.map(x => {
    return {
      id: x.id
    };
  }));
};

const getById = (req, res, list) => {
  const id = Number(req.params.id);
  const entry = list.find(x => x.id === id);

  if( typeof entry !== "undefined") {
    res.json(entry);
  } else {
    res.sendStatus(404);
  }
};

exports.get_all_employees = (req,res) => {
  getAll(res, data.employees);
}

exports.get_employee = (req,res) => {
  getById(req, res, data.employees);
}

exports.get_all_locations = (req,res) => {
  getAll(res, data.locations);
}

exports.get_location = (req,res) => {
  getById(req, res, data.locations);
}

exports.get_all_teams = (req,res) => {
  getAll(res, data.teams);
}

exports.get_team = (req,res) => {
  getById(req, res, data.teams);
}
