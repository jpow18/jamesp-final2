const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(statesController.getAllStates);
    // .post(statesController.createNewFunfact)
    // //router.route('/:state')
    // .get(statesController.getState);
    
module.exports = router;
    

    //     .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), statesController.createNewEmployee)
    //     .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), statesController.updateEmployee)
    //     .delete(verifyRoles(ROLES_LIST.Admin), statesController.deleteEmployee);