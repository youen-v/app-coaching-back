
const express = require('express');
const router = express.Router();
const Exercise_Controller = require('../controllers/Exercise_Controller');
const { authenticate } = require('../middlewares/auth'); 


router.get('/exercises/public', Exercise_Controller.getAll);

router.use(authenticate); 


router.post('/exercises', Exercise_Controller.create);
router.get('/exercises', Exercise_Controller.getAll);
router.get('/exercises/:id', Exercise_Controller.getById);
router.put('/exercises/:id', Exercise_Controller.update);
router.delete('/exercises/:id', Exercise_Controller.delete);

router.get('/sports/:sportId/exercises', Exercise_Controller.getBySport);

module.exports = router;