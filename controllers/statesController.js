const data = {};
data.states = require('../model/statesData.json');
const State = require('../model/States');
const { verifyState } = require('../middleware/verifyStates');

const getAllStates = async (req, res) => {
  //const funfacts = await State.find();
  res.json(data.states);
}

const createNewFunfact = async (req, res) => {
  if (!req?.body?.funfacts || !req?.body?.stateCode) {

  }

  try {
    const result = await State.create({
      stateCode: req.body.statecode,
      funfacts: req.body.funfacts
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = { getAllStates };