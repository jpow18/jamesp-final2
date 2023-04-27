const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(statesController.getAllStates);

router.route('/:stateCode')
    .get(statesController.getOneState);

router.route('/:stateCode/:something')
    .get(statesController.getOneStateThing)
    .post(statesController.createNewFunfact)
    .patch(statesController.patchFunfact)
    .delete(statesController.deleteFunfact);
    
module.exports = router;