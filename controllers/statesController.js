const data = {};
data.states = require('../model/statesData.json');
const State = require('../model/States');

const getAllStates = async (req, res) => {
  //const funfacts = await State.find();
  res.json(data.states);
}

const createNewFunfact = async (req, res) => {
  if (!req?.body?.funfacts) {
    
  }
}

module.exports = { getAllStates };