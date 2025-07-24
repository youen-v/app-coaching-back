const express = require('express');
const router = express.Router();
const Program_Controller = require('../controllers/Program_Controller');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.post('/', Program_Controller.create);
router.get('/', Program_Controller.get_User_Programs);
router.get('/active', Program_Controller.get_Active_Programs);
router.get('/:id', Program_Controller.get_By_Id);
router.put('/:id', Program_Controller.update);
router.delete('/:id', Program_Controller.delete);

// ✅ CORRIGÉ : Sans /programs
router.post('/:id/duplicate', Program_Controller.duplicate);

module.exports = router;