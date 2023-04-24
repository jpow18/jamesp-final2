const states = require('../model/statesData.json');
const stateAbbreviations = new Array(50);

for (i = 0; i < 50; i++) {
  stateAbbreviations.push(states.code);
}


const verifyStates = (state) => {
  if (stateAbbreviations.find(state)) {
    return true;
  } else {
    return false;
  }
}

module.exports = verifyStates;