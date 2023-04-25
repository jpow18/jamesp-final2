const data = {};
data.states = require('../model/statesData.json');
const State = require('../model/States');
const verifyState = require('../middleware/verifyState');

const getAllStates = async (req, res) => {
  //const funfacts = await State.find();
  res.json(data.states);
}

const getOneState = async (req, res) => {
  if (!req?.params?.state) {

  }
}

const createNewFunfact = async (req, res) => {
  if (!req?.body?.funfacts || !req?.params?.stateCode) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Verify that stateCode is valid
  const stateCode = req.params.stateCode.toUpperCase();
  if (!verifyState(stateCode)) {
    res.status(400).json({ error: 'Invalid state code' });
    return;
  }

  // verify that funfacts is an array
  if (!Array.isArray(req.body.funfacts)) {
    return res.status(400).json({ error: 'funfacts must be an array' });
  }

  try {
    const result = await State.findOneAndUpdate(
      { stateCode },
      { $addToSet: { funfacts: req.body.funfacts } },
      { new: true, upsert: true }
    );
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getAllStates, createNewFunfact };