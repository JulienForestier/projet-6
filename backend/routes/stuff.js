const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const stuffCtrl = require('../controllers/stuff')

router.post('/',auth, stuffCtrl.createThing);
router.put('/:id',auth, stuffCtrl.modifyThing)
router.delete('/:id' ,auth, stuffCtrl.deleteThing)
router.get('/:id',auth, stuffCtrl.getOne)
router.get('/',auth, stuffCtrl.getAll)

module.exports = router;