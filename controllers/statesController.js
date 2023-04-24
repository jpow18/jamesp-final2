const data = {};
data.states = require('../model/statesData.json');

const getAllStates = (req, res) => {
  res.json(data.states);
}

module.exports = { getAllStates };