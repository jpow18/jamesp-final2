const data = {};
data.states = require('../model/statesData.json');
const State = require('../model/States');
const verifyState = require('../middleware/verifyState');

const getAllStates = async (req, res) => {
  //const funfacts = await State.find();
  res.json(data.states);
}

const getOneState = async (req, res) => {
  if (!req?.params?.stateCode) {
    res.status(400).json({ message: 'Statecode required' });
    return;
  }

  // Verify that stateCode is valid
  const stateCode = req.params.stateCode.toUpperCase();
  if (!verifyState(stateCode)) {
    res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    return;
  }

  const state = data.states.find(s => s.code === stateCode);

  const funFact = await State.findOne({ _stateCode: stateCode }).select('funfacts').exec();
  console.log(funFact);
  if (!funFact) {
    return res.json({ message: `No Fun Facts found for ${state}`})
  }

  state.funfacts = funFact;
  res.json(state);
}

const createNewFunfact = async (req, res) => {
  if (!req?.body?.funfacts) {
    res.status(400).json({ message: 'State fun facts value required' });
    return;
  }

  // Verify that stateCode is valid
  const stateCode = req.params.stateCode.toUpperCase();
  if (!verifyState(stateCode)) {
    res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    return;
  }

  // verify that funfacts is an array
  if (!Array.isArray(req.body.funfacts)) {
    return res.status(400).json({ message: 'State fun facts value must be an array' });
  }

  try {
    const result = await State.findOneAndUpdate(
      { stateCode },
      { $push: { funfacts: req.body.funfacts } },
      { new: true, upsert: true }
    );
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getAllStates, getOneState, createNewFunfact };