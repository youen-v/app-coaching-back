
const express = require('express');
const router = express.Router();
const Program_Controller = require('../controllers/Program_Controller');
const { authenticate } = require('../middlewares/auth');


router.use(authenticate);

router.post('/programs', Program_Controller.create);
router.get('/programs', Program_Controller.get_User_Programs);
router.get('/programs/active', Program_Controller.get_Active_Programs);
router.get('/programs/:id', Program_Controller.get_By_Id);
router.put('/programs/:id', Program_Controller.update);
router.delete('/programs/:id', Program_Controller.delete);

router.post('/programs/:id/duplicate', Program_Controller.duplicate);

module.exports = router;