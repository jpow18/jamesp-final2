const data = {};
data.states = require('../model/statesData.json');
const State = require('../model/States');
const verifyState = require('../middleware/verifyState');

const getAllStates = async (req, res) => {
  let stateArray = new Array();
  // check if query for contigous states has been passed
  if (!req?.query?.contig) { // if not...
    for (const element of data.states) {
      const stateCode = element.code;
      const funFact = await State.findOne({ stateCode: stateCode }).select('funfacts -_id').exec();
      if (funFact) {
        element.funfacts = funFact.funfacts;
      }
      stateArray.push(element);
    }
  } else { // if so...
    if (req?.query?.contig === 'true') {
      for (const element of data.states) {
        // Skip AK and HI
        if (element.code === 'AK' || element.code === 'HI')
          continue;
        else {
          const stateCode = element.code;
          const funFact = await State.findOne({ stateCode: stateCode }).select('funfacts -_id').exec();
          if (funFact) {
            element.funfacts = funFact.funfacts;
          }
          stateArray.push(element);
        }
      }
    } else {
      for (const element of data.states) {
        // Skip AK and HI
        if (element.code === 'AK' || element.code === 'HI') {
          const stateCode = element.code;
          const funFact = await State.findOne({ stateCode: stateCode }).select('funfacts -_id').exec();
          if (funFact) {
            element.funfacts = funFact.funfacts;
          }
          stateArray.push(element);
        } else {
          continue;
        }
      }
    }
  }
  res.json(stateArray);
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

  const funFact = await State.findOne({ stateCode: stateCode }).select('funfacts -_id').exec();
  if (!funFact) {
    res.json(state);
  } else {
    state.funfacts = funFact.funfacts;
    res.json(state);
  }
}

const getOneStateThing = async (req, res) => {
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

  let fact;
  switch (req.params.something) {

    case 'funfact':
      // generate random funfact for this state or send back the appropriate message
      const funFact = await State.findOne({ stateCode: stateCode }).select('funfacts -_id').exec();
      if (!funFact) {
        return res.json({ message: `No Fun Facts found for ${state.state}` })
      } else {
        const randomIndex = Math.floor(Math.random() * funFact.funfacts.length);
        fact = { 'funfact': `${ funFact.funfacts[randomIndex] }` };
      }
      break;
    case 'capital':
      fact = { 'state': `${state.state}`, 'capital': `${state.capital_city}` }
      break;
    case 'nickname':
      fact = { 'state': `${state.state}`, 'nickname': `${state.nickname}` }
      break;
    case 'population':
      fact = { 'state': `${state.state}`, 'population': `${state.population.toLocaleString()}` }
      break;
    case 'admission':
      fact = { 'state': `${state.state}`, 'admitted': `${state.admission_date}` }
      break;
  }

  res.json(fact);

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

const patchFunfact = async (req, res) => {
  // Verify that index and funfact properties are present in request body
  if (!req?.body?.index) {
    res.status(400).json({ message: 'State fun fact index value required' });
    return;
  }
  if (!req?.body?.funfact) {
    res.status(400).json({ message: 'State fun fact value required' });
    return;
  }

  // Subtract 1 from index to adjust for zero-based data array
  const adjustedIndex = req.body.index - 1;

  // Verify that stateCode is valid
  const stateCode = req.params.stateCode.toUpperCase();
  
  if (!verifyState(stateCode)) {
    res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    return;
  }

  try {
    const state = await State.findOne({ stateCode: stateCode }).exec();

    const stateName = data.states.find(s => s.code === stateCode);
    if (!state) {
      return res.status(404).json({ message: `No Fun Facts found for ${stateName.state}` });
    }

    // Check if index is within range of funfacts array
    if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
      res.status(400).json({ message: `No Fun Fact found at that index for ${stateName.state}` });
      return;
    }

    // Update funfact at specified index and save state
    state.funfacts[adjustedIndex] = req.body.funfact;
    await state.save();

    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteFunfact = async (req, res) => {
  // Verify that index property is present in request body
  if (!req?.body?.index) return res.status(400).json({ message: 'State fun fact index value required' });

  // Subtract 1 from index to adjust for zero-based data array
  const adjustedIndex = req.body.index - 1;

  // Verify that stateCode is valid
  const stateCode = req.params.stateCode.toUpperCase();
  
  if (!verifyState(stateCode)) return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  try {
    const state = await State.findOne({ stateCode: stateCode }).exec();

    const stateName = data.states.find(s => s.code === stateCode);
    if (!state) {
      return res.status(404).json({ message: `No Fun Facts found for ${stateName.state}` });
    }

    // Check if index is within range of funfacts array
    if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
      res.status(400).json({ message: `No Fun Fact found at that index for ${stateName.state}` });
      return;
    }

    // Remove one item from funfacts array at specified index and save state
    state.funfacts.splice(adjustedIndex, 1);
    await state.save();

    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { getAllStates, getOneState, getOneStateThing, createNewFunfact, patchFunfact , deleteFunfact};