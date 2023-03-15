const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const stuffCtrl = require('../controllers/sauce')

router.post('/', auth, multer, stuffCtrl.createSauce);
router.post('/:id/like', auth, stuffCtrl.likeSauce)
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.get('/', auth, stuffCtrl.getAll);
router.get('/:id', auth, stuffCtrl.getOne)


module.exports = router;